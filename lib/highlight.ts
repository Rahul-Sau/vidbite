export function getHighlightConfig(title: string, description?: string | null) {
  const text = `${title} ${description ?? ""}`.toLowerCase();

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  let duration = 8;
  if (wordCount > 25) duration = 15;
  else if (wordCount > 10) duration = 12;

  const startsSlow = ["tutorial", "guide", "how to", "vlog", "walkthrough"];
  const startOffset = startsSlow.some((word) => text.includes(word)) ? 3 : 0;

  return { duration, startOffset };
}
