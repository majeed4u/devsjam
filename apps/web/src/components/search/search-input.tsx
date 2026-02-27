import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SearchInput({
  placeholder = "Search posts...",
  className = "",
  size = "md",
}: SearchInputProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      navigate({ to: "/search", search: { q: query.trim() } });
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  const sizeClasses = {
    sm: "h-9 text-sm",
    md: "h-10 text-base",
    lg: "h-11 text-lg",
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-full border border-border bg-background pl-10 pr-10 ${sizeClasses[size]} text-foreground placeholder:text-foreground/40 shadow-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/40 hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
