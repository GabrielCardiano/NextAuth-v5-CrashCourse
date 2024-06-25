import { UserInfo } from "@/components/user-info";
import { getCurrentUser } from "@/hooks/auth";

// Render user infos using SSR with lib @auth;
async function ServerPage() {
  const user = await getCurrentUser();

  return <UserInfo user={user} label="Server component 💻"/>;
}

export default ServerPage;
