export type PermalinkStructure = "post_name" | "day_name" | "month_name" | "plain" | "custom";

export function generatePostUrl(
  post: { id: string, slug: string, publishedAt?: Date | null }, 
  structure: PermalinkStructure = "post_name", 
  customPattern?: string
): string {
  const date = post.publishedAt || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch(structure) {
    case "post_name": 
      return `/blog/${post.slug}`;
    case "day_name": 
      return `/blog/${year}/${month}/${day}/${post.slug}`;
    case "month_name": 
      return `/blog/${year}/${month}/${post.slug}`;
    case "plain": 
      return `/blog/?p=${post.id}`;
    case "custom":
      if (customPattern) {
        let url = customPattern
          .replace("%postname%", post.slug)
          .replace("%year%", year.toString())
          .replace("%monthnum%", month)
          .replace("%day%", day)
          .replace("%post_id%", post.id);
        if (!url.startsWith("/")) {
          url = "/" + url;
        }
        return url;
      }
      return `/blog/${post.slug}`;
    default: 
      return `/blog/${post.slug}`;
  }
}
