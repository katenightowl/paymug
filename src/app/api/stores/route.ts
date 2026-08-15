import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { createStore, getActiveStoreForUser } from "@/lib/stores";
import { jsonError } from "@/lib/utils";

const createStoreSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(80),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);
  return Response.json({
    store: await getActiveStoreForUser(user.id, user.activeStoreId),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);
  const parsed = createStoreSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || "Invalid store");
  }
  const slug = slugify(parsed.data.slug);
  if (!slug) return jsonError("Store URL is invalid");
  try {
    const store = await createStore({
      userId: user.id,
      name: parsed.data.name,
      slug,
    });
    return Response.json({ store }, { status: 201 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not create store",
      409
    );
  }
}
