import { getSessionUser } from "@/lib/auth";
import { sendEmailCampaign } from "@/lib/email-campaigns";
import { jsonError } from "@/lib/utils";
import type { CampaignSendRouteContext } from "./route.types";

export async function POST(
  req: Request,
  { params }: CampaignSendRouteContext
) {
  const user = await getSessionUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { id } = await params;
  try {
    return Response.json({
      result: await sendEmailCampaign(
        user.id,
        id,
        req.url,
        user.activeStoreId,
        user.environment
      ),
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not send campaign",
      400
    );
  }
}
