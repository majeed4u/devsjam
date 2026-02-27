/**
 * Calculate estimated reading time for content
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  if (!content || content.trim().length === 0) {
    return 1; // Minimum 1 minute
  }

  // Remove HTML tags if present
  const textContent = content.replace(/<[^>]*>/g, " ");

  // Count words (split by whitespace)
  const words = textContent.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;

  // Calculate and round up to nearest minute
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return readingTime;
}
