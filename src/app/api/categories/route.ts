import { NextResponse } from "next/server";
import { getProductCategories } from "@/lib/products";
import { decodeHtml } from "@/lib/text";

export const revalidate = 300;

export async function GET() {
  const categories = await getProductCategories();
  return NextResponse.json(
    categories.map((category) => ({
      slug: category.slug,
      name: decodeHtml(category.name),
      productCount: category.productCount,
    })),
  );
}
