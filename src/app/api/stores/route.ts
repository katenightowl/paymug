import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { createStore, listStoresByUser } from "@/lib/stores";
import { jsonError } from "@/lib/utils";

const createStoreSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(80),
  useCurrentPaymentCredentials: z.boolean().default(true),
  useCurrentGitHubCredentials: z.boolean().default(true),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);
  return Response.json({ stores: await listStoresByUser(user.id) });
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
      currentStoreId: user.activeStoreId,
      useCurrentPaymentCredentials:
        parsed.data.useCurrentPaymentCredentials,
      useCurrentGitHubCredentials:
        parsed.data.useCurrentGitHubCredentials,
    });
    return Response.json({ store }, { status: 201 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not create store",
      409
    );
  }
}
