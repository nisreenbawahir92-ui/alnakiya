"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=config");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata.role !== "admin") redirect("/login");

  return supabase;
}

function revalidateCatalog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/categories");
  if (slug) revalidatePath(`/product/${slug}`);
}

function storagePathFromPublicUrl(url: string | null | undefined) {
  if (!url) return null;
  const marker = "/storage/v1/object/public/product-images/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

async function uploadProductImage(
  supabase: SupabaseClient,
  image: FormDataEntryValue | null,
  redirectOnError: string,
) {
  if (!(image instanceof File) || image.size === 0) return null;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(image.type) || image.size > 5 * 1024 * 1024) {
    redirect(`${redirectOnError}?error=image`);
  }

  const extension = image.name.split(".").pop()?.toLowerCase() || "webp";
  const filePath = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, image, { contentType: image.type, upsert: false });

  if (uploadError) {
    console.error("Product image upload failed:", uploadError.message);
    redirect(`${redirectOnError}?error=upload`);
  }

  return supabase.storage.from("product-images").getPublicUrl(filePath).data
    .publicUrl;
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(requestedSlug || title);
  const categoryName = String(formData.get("category") ?? "").trim();
  const categorySlug = slugify(categoryName);
  const priceValue = String(formData.get("price") ?? "").trim();
  const price = Number(priceValue);
  const stockStatus =
    formData.get("stockStatus") === "outofstock" ? "outofstock" : "instock";
  const image = formData.get("image");

  if (
    !title ||
    !slug ||
    !categoryName ||
    !priceValue ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    redirect("/dashboard/products/new?error=invalid");
  }

  const imageUrl = await uploadProductImage(
    supabase,
    image,
    "/dashboard/products/new",
  );

  const category = {
    id: 0,
    name: categoryName,
    slug: categorySlug,
    taxonomy: "product_cat",
    description: "",
    parentId: 0,
  };
  const { error } = await supabase.from("products").insert({
    title,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    short_description:
      String(formData.get("shortDescription") ?? "").trim() || null,
    sku: String(formData.get("sku") ?? "").trim() || null,
    price,
    regular_price: price,
    currency: "AED",
    stock_status: stockStatus,
    image_url: imageUrl,
    categories: [category],
    is_published: formData.get("published") === "on",
  });

  if (error) {
    console.error("Product creation failed:", error.message);
    redirect(
      `/dashboard/products/new?error=${error.code === "23505" ? "slug" : "save"}`,
    );
  }

  revalidateCatalog(slug);
  revalidatePath(`/category/${categorySlug}`);
  redirect("/dashboard/products?created=1");
}

export async function createCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(requestedSlug || name);
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !slug) {
    redirect("/dashboard/categories?error=invalid");
  }

  const { error } = await supabase.from("product_categories").insert({
    name,
    slug,
    description: description || null,
  });

  if (error) {
    console.error("Category creation failed:", error.message);
    redirect(
      `/dashboard/categories?error=${error.code === "23505" ? "slug" : "save"}`,
    );
  }

  revalidateCatalog();
  redirect("/dashboard/categories?created=1");
}

export async function updateCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(requestedSlug || name);
  const description = String(formData.get("description") ?? "").trim();

  if (!id || !name || !slug) {
    redirect("/dashboard/categories?error=invalid");
  }

  const { error } = await supabase
    .from("product_categories")
    .update({
      name,
      slug,
      description: description || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Category update failed:", error.message);
    redirect(
      `/dashboard/categories?error=${error.code === "23505" ? "slug" : "save"}`,
    );
  }

  revalidateCatalog();
  redirect("/dashboard/categories?updated=1");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/dashboard/categories?error=invalid");

  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Category deletion failed:", error.message);
    redirect("/dashboard/categories?error=delete");
  }

  revalidateCatalog();
  redirect("/dashboard/categories?deleted=1");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: existing } = await supabase
    .from("products")
    .select("image_url, slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Product deletion failed:", error.message);
    redirect("/dashboard/products?error=delete");
  }

  const storagePath = storagePathFromPublicUrl(existing?.image_url);
  if (storagePath) {
    const { error: removeError } = await supabase.storage
      .from("product-images")
      .remove([storagePath]);
    if (removeError) {
      console.error("Product image cleanup failed:", removeError.message);
    }
  }

  revalidateCatalog(existing?.slug);
  redirect("/dashboard/products?deleted=1");
}

export async function hideLegacyProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const legacyId = String(formData.get("id") ?? "");
  if (!legacyId) return;

  const { data: current } = await supabase
    .from("product_overrides")
    .select("product_data")
    .eq("legacy_id", legacyId)
    .maybeSingle();

  const { error } = await supabase.from("product_overrides").upsert({
    legacy_id: legacyId,
    product_data: current?.product_data ?? {},
    is_deleted: true,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Unable to hide JSON product:", error.message);
    redirect("/dashboard?error=delete");
  }

  revalidateCatalog();
  redirect("/dashboard?hidden=1");
}

export async function restoreLegacyProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const legacyId = String(formData.get("id") ?? "");
  if (!legacyId) return;

  const { error } = await supabase
    .from("product_overrides")
    .delete()
    .eq("legacy_id", legacyId);

  if (error) {
    console.error("Unable to restore JSON product:", error.message);
    redirect("/dashboard?error=restore");
  }

  revalidateCatalog();
  redirect("/dashboard?restored=1");
}

export async function updateProduct(formData: FormData) {
  const supabase = await requireAdmin();
  const source = String(formData.get("source") ?? "");
  const id = String(formData.get("id") ?? "");
  const originalSlug = String(formData.get("originalSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? title));
  const categoryName = String(formData.get("category") ?? "").trim();
  const categorySlug = slugify(categoryName);
  const priceValue = String(formData.get("price") ?? "").trim();
  const price = priceValue ? Number(priceValue) : null;
  const stockStatus =
    formData.get("stockStatus") === "outofstock" ? "outofstock" : "instock";
  const redirectBase = `/dashboard/products/${source}/${id}`;

  if (
    !id ||
    !title ||
    !slug ||
    !categoryName ||
    (price !== null && (!Number.isFinite(price) || price < 0))
  ) {
    redirect(`${redirectBase}?error=invalid`);
  }

  const products = await getProducts();
  if (
    products.some(
      (product) =>
        product.slug === slug &&
        !(product.id === id && product.source === source),
    )
  ) {
    redirect(`${redirectBase}?error=slug`);
  }

  const category = {
    id: 0,
    name: categoryName,
    slug: categorySlug,
    taxonomy: "product_cat",
    description: "",
    parentId: 0,
  };
  const description = String(formData.get("description") ?? "").trim();
  const shortDescription = String(
    formData.get("shortDescription") ?? "",
  ).trim();
  const sku = String(formData.get("sku") ?? "").trim() || null;
  const imageUrl = await uploadProductImage(
    supabase,
    formData.get("image"),
    redirectBase,
  );

  if (source === "json") {
    const { data: current } = await supabase
      .from("product_overrides")
      .select("product_data")
      .eq("legacy_id", id)
      .maybeSingle();
    const currentData =
      (current?.product_data as Record<string, unknown> | null) ?? {};

    const { error } = await supabase.from("product_overrides").upsert({
      legacy_id: id,
      product_data: {
        ...currentData,
        title,
        slug,
        description,
        shortDescription,
        sku,
        price: price?.toString() ?? null,
        regularPrice: price?.toString() ?? null,
        stockStatus,
        categories: [category],
        ...(imageUrl
          ? {
              image: {
                id,
                title,
                alt: title,
                caption: "",
                description: "",
                mimeType: "image/webp",
                file: null,
                sourceUrl: imageUrl,
                url: imageUrl,
              },
            }
          : {}),
        updatedAt: new Date().toISOString(),
      },
      is_deleted: false,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Unable to edit JSON product:", error.message);
      redirect(`${redirectBase}?error=save`);
    }
  } else {
    const { data: existing } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase
      .from("products")
      .update({
        title,
        slug,
        description: description || null,
        short_description: shortDescription || null,
        sku,
        price,
        regular_price: price,
        stock_status: stockStatus,
        categories: [category],
        ...(imageUrl ? { image_url: imageUrl } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Unable to edit Supabase product:", error.message);
      redirect(`${redirectBase}?error=save`);
    }

    if (imageUrl) {
      const oldPath = storagePathFromPublicUrl(existing?.image_url);
      if (oldPath) {
        await supabase.storage.from("product-images").remove([oldPath]);
      }
    }
  }

  revalidateCatalog(originalSlug);
  revalidateCatalog(slug);
  redirect("/dashboard/products?updated=1");
}

export async function changeAdminPassword(formData: FormData) {
  const supabase = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/dashboard/account?error=session");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (
    currentPassword.length < 8 ||
    newPassword.length < 8 ||
    newPassword.length > 72
  ) {
    redirect("/dashboard/account?error=invalid");
  }

  if (newPassword !== confirmPassword) {
    redirect("/dashboard/account?error=mismatch");
  }

  if (currentPassword === newPassword) {
    redirect("/dashboard/account?error=same");
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    redirect("/dashboard/account?error=current");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    console.error("Password update failed:", error.message);
    redirect("/dashboard/account?error=save");
  }

  redirect("/dashboard/account?updated=1");
}
