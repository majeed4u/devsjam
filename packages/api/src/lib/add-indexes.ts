import prisma from "@devjams/db";

/**
 * Add database indexes for improved query performance
 * Run this once to set up indexes
 */
export async function addPerformanceIndexes() {
  console.log("🔍 Adding performance indexes...");

  const indexes = [
    // Post indexes
    "CREATE INDEX IF NOT EXISTS idx_post_published_archived ON \"Post\"(published, archived) WHERE published = true AND archived = false",
    "CREATE INDEX IF NOT EXISTS idx_post_slug ON \"Post\"(slug) WHERE slug IS NOT NULL",
    "CREATE INDEX IF NOT EXISTS idx_post_created_at ON \"Post\"(createdAt DESC)",
    "CREATE INDEX IF NOT EXISTS idx_post_views ON \"Post\"(views DESC)",
    "CREATE INDEX IF NOT EXISTS idx_post_category ON \"Post\"(categoryId) WHERE categoryId IS NOT NULL",
    "CREATE INDEX IF NOT EXISTS idx_post_series ON \"Post\"(seriesId) WHERE seriesId IS NOT NULL",
    "CREATE INDEX IF NOT EXISTS idx_post_series_order ON \"Post\"(seriesId, seriesOrder) WHERE seriesId IS NOT NULL",

    // Tag indexes
    "CREATE INDEX IF NOT EXISTS idx_tag_name ON \"Tag\"(name)",
    "CREATE INDEX IF NOT EXISTS idx_tag_slug ON \"Tag\"(slug)",

    // Category indexes
    "CREATE INDEX IF NOT EXISTS idx_category_name ON \"Category\"(name)",
    "CREATE INDEX IF NOT EXISTS idx_category_slug ON \"Category\"(slug)",

    // Series indexes
    "CREATE INDEX IF NOT EXISTS idx_series_title ON \"Series\"(title)",
    "CREATE INDEX IF NOT EXISTS idx_series_slug ON \"Series\"(slug)",

    // PostTag junction table indexes
    "CREATE INDEX IF NOT EXISTS idx_posttag_post ON \"PostTag\"(postId)",
    "CREATE INDEX IF NOT EXISTS idx_posttag_tag ON \"PostTag\"(tagId)",
  ];

  for (const indexSql of indexes) {
    try {
      await prisma.$executeRawUnsafe(indexSql);
      console.log(`✅ Created: ${indexSql.split(" ON ")[1]}`);
    } catch (error: any) {
      console.warn(`⚠️  Skipped: ${error.message}`);
    }
  }

  console.log("✨ Performance indexes added successfully!");
}

/**
 * Add full-text search indexes
 */
export async function addFullTextSearchIndexes() {
  console.log("🔍 Adding full-text search indexes...");

  try {
    // PostgreSQL full-text search on posts
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_post_fulltext_search
      ON \"Post\" USING gin(to_tsvector('english',
        COALESCE(title, '') || ' ' ||
        COALESCE(content, '') || ' ' ||
        COALESCE(excerpt, '')
      ))
    `);

    console.log("✅ Full-text search index created");
  } catch (error: any) {
    console.warn("⚠️  Full-text search index skipped:", error.message);
  }
}
