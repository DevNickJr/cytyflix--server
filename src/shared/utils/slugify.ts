export function generateSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function validateSlug(slug: string): boolean {
  if (slug.length < 3 || slug.length > 50) return false;
  return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug);
}
