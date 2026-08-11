import { getSessionUser } from "@/lib/auth";
import { LandingPage } from "./LandingPage";

export default async function HomePage() {
  const user = await getSessionUser();

  return <LandingPage isAuthenticated={Boolean(user)} />;
}
