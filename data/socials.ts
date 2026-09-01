export const socials = {
  github: "https://github.com/priyanshu172004",
  githubUser: "priyanshu172004",
  linkedin: "https://www.linkedin.com/in/priyanshu-srivastava-417075317",
  leetcode: "https://leetcode.com/u/Priyanshu_17_Srivastava/",
  leetcodeUser: "Priyanshu_17_Srivastava",
  email: "srivastavapriyanshu17042004@gmail.com",
} as const;

/**
 * Cal.com booking target.
 *
 * The embed expects a handle ("priyanshu/30min"), not a URL — pasting the full
 * cal.com link silently produces a scheduler that never loads. Accept either
 * form and normalise here so the env var is forgiving.
 */
export const calLink = normaliseCalLink(process.env.NEXT_PUBLIC_CAL_LINK);

function normaliseCalLink(raw: string | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return "";
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?cal\.com\//i, "")
    .replace(/^\/+|\/+$/g, "");
}
