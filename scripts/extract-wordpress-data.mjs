import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline";

const root = resolve(import.meta.dirname, "..");
const sqlPath = resolve(root, ".migration", "backup.sql");
const outputDir = resolve(root, "src", "data");

const posts = [];
const terms = new Map();
const taxonomies = new Map();
const relationships = new Map();
const metadata = new Map();
const termMetadata = new Map();
const options = new Map();

const retainedMetaKeys = new Set([
  "_sku",
  "_regular_price",
  "_sale_price",
  "_price",
  "_stock",
  "_stock_status",
  "_manage_stock",
  "_thumbnail_id",
  "_product_image_gallery",
  "_featured",
  "_virtual",
  "_downloadable",
  "_weight",
  "_length",
  "_width",
  "_height",
  "_purchase_note",
  "_sold_individually",
  "_tax_status",
  "_tax_class",
  "_product_attributes",
  "_elementor_data",
  "_elementor_edit_mode",
  "_elementor_page_settings",
  "_wp_page_template",
  "_wp_attached_file",
  "_wp_attachment_metadata",
  "_wp_attachment_image_alt",
  "_menu_item_type",
  "_menu_item_menu_item_parent",
  "_menu_item_object_id",
  "_menu_item_object",
  "_menu_item_target",
  "_menu_item_url",
  "_menu_item_xfn",
  "_menu_item_classes",
  "total_sales",
]);

const retainedOptions = new Set([
  "siteurl",
  "home",
  "blogname",
  "blogdescription",
  "show_on_front",
  "page_on_front",
  "page_for_posts",
  "woocommerce_shop_page_id",
  "woocommerce_cart_page_id",
  "woocommerce_checkout_page_id",
  "woocommerce_myaccount_page_id",
  "woocommerce_currency",
  "woocommerce_currency_pos",
  "woocommerce_price_num_decimals",
  "woocommerce_weight_unit",
  "woocommerce_dimension_unit",
]);

function parseValues(input, onRow) {
  let index = input.indexOf("VALUES");
  index = index === -1 ? 0 : index + 6;

  const skipWhitespace = () => {
    while (/\s/.test(input[index] ?? "")) index += 1;
  };

  while (index < input.length) {
    skipWhitespace();
    if (input[index] === ";") break;
    if (input[index] === ",") {
      index += 1;
      skipWhitespace();
    }
    if (input[index] !== "(") break;
    index += 1;

    const row = [];
    while (index < input.length) {
      skipWhitespace();
      let value = "";

      if (input[index] === "'") {
        index += 1;
        let segmentStart = index;
        const segments = [];
        while (index < input.length) {
          const character = input[index];
          if (character === "\\") {
            segments.push(input.slice(segmentStart, index));
            const escaped = input[index + 1];
            const replacements = {
              0: "\0",
              b: "\b",
              n: "\n",
              r: "\r",
              t: "\t",
              Z: "\x1a",
              "\\": "\\",
              "'": "'",
              '"': '"',
            };
            segments.push(replacements[escaped] ?? escaped);
            index += 2;
            segmentStart = index;
          } else if (character === "'" && input[index + 1] === "'") {
            segments.push(input.slice(segmentStart, index), "'");
            index += 2;
            segmentStart = index;
          } else if (character === "'") {
            segments.push(input.slice(segmentStart, index));
            value = segments.join("");
            index += 1;
            break;
          } else {
            index += 1;
          }
        }
      } else {
        const start = index;
        while (
          index < input.length &&
          input[index] !== "," &&
          input[index] !== ")"
        ) {
          index += 1;
        }
        const raw = input.slice(start, index).trim();
        if (raw === "NULL") value = null;
        else if (/^-?\d+(?:\.\d+)?$/.test(raw)) value = Number(raw);
        else value = raw;
      }

      row.push(value);
      skipWhitespace();
      if (input[index] === ",") {
        index += 1;
        continue;
      }
      if (input[index] === ")") {
        index += 1;
        break;
      }
      throw new Error(
        `Unexpected SQL value separator at ${index}: ${JSON.stringify(
          input.slice(Math.max(0, index - 40), index + 40),
        )}`,
      );
    }

    onRow(row);
  }
}

function addMeta(postId, key, value) {
  if (!retainedMetaKeys.has(key)) return;
  const postMetadata = metadata.get(postId) ?? {};
  if (postMetadata[key] === undefined) postMetadata[key] = value;
  metadata.set(postId, postMetadata);
}

function addRelationship(objectId, taxonomyId) {
  const ids = relationships.get(objectId) ?? [];
  ids.push(taxonomyId);
  relationships.set(objectId, ids);
}

function addTermMeta(termId, key, value) {
  if (!["thumbnail_id", "brand_image", "brand_image_id"].includes(key)) return;
  const values = termMetadata.get(termId) ?? {};
  values[key] = value;
  termMetadata.set(termId, values);
}

const handlers = {
  wp_posts: (row) => {
    posts.push({
      id: row[0],
      authorId: row[1],
      date: row[2],
      dateGmt: row[3],
      content: row[4],
      title: row[5],
      excerpt: row[6],
      status: row[7],
      password: row[10],
      slug: row[11],
      modified: row[14],
      modifiedGmt: row[15],
      parentId: row[17],
      guid: row[18],
      menuOrder: row[19],
      type: row[20],
      mimeType: row[21],
    });
  },
  wp_postmeta: (row) => addMeta(row[1], row[2], row[3]),
  wp_terms: (row) =>
    terms.set(row[0], {
      id: row[0],
      name: row[1],
      slug: row[2],
      group: row[3],
    }),
  wp_term_taxonomy: (row) =>
    taxonomies.set(row[0], {
      id: row[0],
      termId: row[1],
      taxonomy: row[2],
      description: row[3],
      parentId: row[4],
      count: row[5],
    }),
  wp_term_relationships: (row) => addRelationship(row[0], row[1]),
  wp_termmeta: (row) => addTermMeta(row[1], row[2], row[3]),
  wp_options: (row) => {
    if (retainedOptions.has(row[1])) options.set(row[1], row[2]);
  },
};

const input = createInterface({
  input: createReadStream(sqlPath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

let activeHandler = null;
for await (const line of input) {
  if (line.startsWith("INSERT INTO `")) {
    const table = line.slice(13, line.indexOf("`", 13));
    activeHandler = handlers[table] ?? null;
    if (line.includes("(") && activeHandler) parseValues(line, activeHandler);
    if (line.endsWith(";")) activeHandler = null;
    continue;
  }

  if (activeHandler) {
    parseValues(line, activeHandler);
    if (line.endsWith(";")) activeHandler = null;
  }
}

function termsFor(postId) {
  return (relationships.get(postId) ?? [])
    .map((taxonomyId) => {
      const taxonomy = taxonomies.get(taxonomyId);
      const term = taxonomy && terms.get(taxonomy.termId);
      if (!taxonomy || !term) return null;
      return {
        id: term.id,
        name: term.name,
        slug: term.slug,
        taxonomy: taxonomy.taxonomy,
        description: taxonomy.description,
        parentId: taxonomy.parentId,
      };
    })
    .filter(Boolean);
}

const attachments = new Map(
  posts
    .filter((post) => post.type === "attachment")
    .map((post) => {
      const meta = metadata.get(post.id) ?? {};
      return [
        post.id,
        {
          id: post.id,
          title: post.title,
          alt: meta._wp_attachment_image_alt ?? "",
          caption: post.excerpt,
          description: post.content,
          mimeType: post.mimeType,
          file: meta._wp_attached_file ?? null,
          sourceUrl: post.guid,
        },
      ];
    }),
);

function imageFor(id) {
  if (!id) return null;
  const image = attachments.get(Number(id));
  if (!image) return null;
  return {
    ...image,
    url: image.file ? `/uploads/${image.file}` : image.sourceUrl,
  };
}

function cleanCell(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractProductModels(html) {
  const rows = [...String(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(
    (row) =>
      [...row[1].matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(
        (cell) => cleanCell(cell[1]),
      ),
  );
  if (rows.length < 2) return [];

  const headers = rows[0].map((header, index) => header || `Column ${index + 1}`);
  return rows
    .slice(1)
    .filter((row) => row.some(Boolean))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => [header, row[index] ?? ""]),
      ),
    );
}

const products = posts
  .filter((post) => post.type === "product" && post.status === "publish")
  .map((post) => {
    const meta = metadata.get(post.id) ?? {};
    const galleryIds = String(meta._product_image_gallery ?? "")
      .split(",")
      .filter(Boolean)
      .map(Number);
    const gallery = galleryIds.map(imageFor).filter(Boolean);
    const assignedTerms = termsFor(post.id);

    return {
      id: String(post.id),
      slug: post.slug,
      title: post.title,
      description: post.content,
      shortDescription: post.excerpt,
      sku: meta._sku || null,
      price: meta._price || null,
      regularPrice: meta._regular_price || null,
      salePrice: meta._sale_price || null,
      currency: options.get("woocommerce_currency") ?? "AED",
      stockStatus: meta._stock_status ?? "instock",
      stockQuantity: meta._stock ?? null,
      manageStock: meta._manage_stock === "yes",
      featured: meta._featured === "yes",
      image: imageFor(meta._thumbnail_id) ?? gallery[0] ?? null,
      gallery,
      models: extractProductModels(post.excerpt),
      categories: assignedTerms.filter(
        (term) => term.taxonomy === "product_cat",
      ),
      tags: assignedTerms.filter((term) => term.taxonomy === "product_tag"),
      brands: assignedTerms.filter((term) =>
        ["brand", "product_brand", "pa_brand"].includes(term.taxonomy),
      ),
      attributes: assignedTerms.filter((term) =>
        term.taxonomy.startsWith("pa_"),
      ),
      dimensions: {
        weight: meta._weight || null,
        length: meta._length || null,
        width: meta._width || null,
        height: meta._height || null,
      },
      createdAt: post.dateGmt || post.date,
      updatedAt: post.modifiedGmt || post.modified,
      source: "json",
    };
  });

const pages = posts
  .filter(
    (post) =>
      ["page", "post", "etheme_portfolio", "staticblocks"].includes(post.type) &&
      post.status === "publish",
  )
  .map((post) => {
    const meta = metadata.get(post.id) ?? {};
    return {
      id: String(post.id),
      type: post.type,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content.includes("so-news-block") ? "" : post.content,
      parentId: String(post.parentId),
      featuredImage: imageFor(meta._thumbnail_id),
      template: meta._wp_page_template ?? null,
      hadElementorData: Boolean(meta._elementor_data),
      terms: termsFor(post.id),
      createdAt: post.dateGmt || post.date,
      updatedAt: post.modifiedGmt || post.modified,
      source: "json",
    };
  });

const postsById = new Map(posts.map((post) => [post.id, post]));
const menus = posts
  .filter((post) => post.type === "nav_menu_item" && post.status === "publish")
  .map((post) => {
    const meta = metadata.get(post.id) ?? {};
    const linkedPost = postsById.get(Number(meta._menu_item_object_id));
    const menu = termsFor(post.id).find((term) => term.taxonomy === "nav_menu");

    return {
      id: String(post.id),
      menu: menu?.name ?? "Primary",
      title: post.title || linkedPost?.title || "",
      url:
        meta._menu_item_url ||
        (linkedPost?.slug ? `/${linkedPost.slug}` : "#"),
      object: meta._menu_item_object ?? null,
      objectId: meta._menu_item_object_id
        ? String(meta._menu_item_object_id)
        : null,
      parentId: String(meta._menu_item_menu_item_parent ?? "0"),
      order: post.menuOrder,
      target: meta._menu_item_target ?? "",
    };
  })
  .sort((a, b) => a.order - b.order);

const categories = [...taxonomies.values()]
  .filter((taxonomy) =>
    ["category", "product_cat", "product_tag"].includes(taxonomy.taxonomy),
  )
  .map((taxonomy) => {
    const termMeta = termMetadata.get(taxonomy.termId) ?? {};
    const imageId =
      termMeta.thumbnail_id ??
      termMeta.brand_image_id ??
      (String(termMeta.brand_image ?? "").match(/^\d+$/)
        ? termMeta.brand_image
        : null);

    return {
      ...terms.get(taxonomy.termId),
      taxonomy: taxonomy.taxonomy,
      description: taxonomy.description,
      parentId: taxonomy.parentId,
      count: taxonomy.count,
      image: imageFor(imageId),
    };
  });

const media = [...attachments.values()].map((image) => ({
  ...image,
  url: image.file ? `/uploads/${image.file}` : image.sourceUrl,
}));

const referencedUploadPaths = new Set();
function collectReferencedUploads(value) {
  if (typeof value !== "string") return;
  const normalized = value.replaceAll("\\/", "/");
  const pattern =
    /https?:\/\/(?:www\.)?alnakiyatrading\.com\/wp-content\/uploads\/([^"'?<>\s)\\]+)/gi;
  for (const match of normalized.matchAll(pattern)) {
    try {
      referencedUploadPaths.add(decodeURIComponent(match[1]));
    } catch {
      referencedUploadPaths.add(match[1]);
    }
  }
}

for (const post of posts) {
  if (
    post.status !== "publish" ||
    !["page", "post", "product", "staticblocks"].includes(post.type)
  ) {
    continue;
  }
  collectReferencedUploads(post.content);
  collectReferencedUploads(post.excerpt);
  collectReferencedUploads(metadata.get(post.id)?._elementor_data);
}

const postTypeStatusCounts = posts.reduce((counts, post) => {
  const key = `${post.type}:${post.status}`;
  counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}, {});

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  resolve(outputDir, "products.json"),
  `${JSON.stringify(products, null, 2)}\n`,
);
writeFileSync(
  resolve(outputDir, "pages.json"),
  `${JSON.stringify(pages, null, 2)}\n`,
);
writeFileSync(
  resolve(outputDir, "wordpress-site.json"),
  `${JSON.stringify(
    {
      options: Object.fromEntries(options),
      categories,
      menus,
      counts: {
        products: products.length,
        pages: pages.length,
        attachments: attachments.size,
        referencedUploadFiles: referencedUploadPaths.size,
        postTypeStatus: postTypeStatusCounts,
      },
    },
    null,
    2,
  )}\n`,
);
writeFileSync(
  resolve(outputDir, "media.json"),
  `${JSON.stringify(media, null, 2)}\n`,
);

const sourceUploads = resolve(
  root,
  ".migration",
  "site",
  "domains",
  "alnakiyatrading.com",
  "public_html",
  "wp-content",
  "uploads",
);
const targetUploads = resolve(root, "public", "uploads");
let copiedMedia = 0;
let missingMedia = 0;
const missingMediaPaths = [];

const filesToCopy = new Set([
  ...media.map((image) => image.file).filter(Boolean),
  ...referencedUploadPaths,
]);

for (const file of filesToCopy) {
  if (file.includes("..")) continue;
  const source = resolve(sourceUploads, file);
  const target = resolve(targetUploads, file);
  if (!existsSync(source)) {
    missingMedia += 1;
    missingMediaPaths.push(file);
    continue;
  }
  if (existsSync(target) && statSync(source).size === statSync(target).size) {
    copiedMedia += 1;
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
  copiedMedia += 1;
}

writeFileSync(
  resolve(root, ".migration", "missing-media.json"),
  `${JSON.stringify(missingMediaPaths, null, 2)}\n`,
);

console.log({
  products: products.length,
  pages: pages.length,
  attachments: attachments.size,
  categories: categories.length,
  copiedMedia,
  missingMedia,
});
