import { headers } from "next/headers";

export const isPayloadAdminPreviewRequest = async () => {
  const headerStore = await headers();
  const referer = headerStore.get("referer") ?? headerStore.get("referrer");

  if (!referer) return false;

  try {
    return new URL(referer).pathname.startsWith("/admin");
  } catch {
    return false;
  }
};
