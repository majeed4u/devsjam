import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BlogFiltersProps {
  categories?: Array<{ id: string; name: string }>;
  tags?: Array<{ id: string; name: string; slug: string }>;
  selectedCategory?: string | null;
  selectedTags?: string[];
  onCategoryChange?: (categoryId: string | null) => void;
  onTagToggle?: (tagSlug: string) => void;
  onClearFilters?: () => void;
}

export function BlogFilters({
  categories = [],
  tags = [],
  selectedCategory,
  selectedTags = [],
  onCategoryChange,
  onTagToggle,
  onClearFilters,
}: BlogFiltersProps) {
  const hasActiveFilters = selectedCategory || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && onClearFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {selectedTags.length} filter{selectedTags.length !== 1 ? "s" : ""}{" "}
            active
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!selectedCategory ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => onCategoryChange?.(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => onCategoryChange?.(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={
                  selectedTags.includes(tag.slug) ? "default" : "outline"
                }
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => onTagToggle?.(tag.slug)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
