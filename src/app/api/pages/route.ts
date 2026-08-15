import { getSessionUser } from "@/lib/auth";
import { createStorePage, listStorePages } from "@/lib/store-pages";
import { jsonError } from "@/lib/utils";
import { storePageSchema } from "./page-api.utils";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);
  return Response.json({
    pages: await listStorePages(
      user.id,
      user.activeStoreId,
      user.environment,
    ),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);
  const parsed = storePageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || "Invalid page");
  }
  try {
    const page = await createStorePage(
      user.id,
      user.activeStoreId,
      user.environment,
      parsed.data,
    );
    return Response.json({ page }, { status: 201 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not create page",
      409,
    );
  }
}
