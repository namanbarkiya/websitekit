import { allNavItems, type SidebarNavItem } from "@/config/sidebar";

export interface SearchResult extends SidebarNavItem {
  matchType: "title" | "description" | "keyword" | "category";
  score: number;
}

/**
 * Search through all nav items using title, description, keywords, and category.
 * Returns results sorted by relevance score.
 */
export function searchTools(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const item of allNavItems) {
    let bestScore = 0;
    let matchType: SearchResult["matchType"] = "title";

    // Title match (highest priority)
    const titleLower = item.title.toLowerCase();
    if (titleLower === normalizedQuery) {
      bestScore = 100; // Exact match
      matchType = "title";
    } else if (titleLower.startsWith(normalizedQuery)) {
      bestScore = 90; // Starts with
      matchType = "title";
    } else if (titleLower.includes(normalizedQuery)) {
      bestScore = 80; // Contains
      matchType = "title";
    }

    // Keyword match (high priority)
    if (item.keywords) {
      for (const keyword of item.keywords) {
        const keywordLower = keyword.toLowerCase();
        if (keywordLower === normalizedQuery) {
          if (95 > bestScore) {
            bestScore = 95;
            matchType = "keyword";
          }
        } else if (keywordLower.startsWith(normalizedQuery)) {
          if (75 > bestScore) {
            bestScore = 75;
            matchType = "keyword";
          }
        } else if (keywordLower.includes(normalizedQuery)) {
          if (60 > bestScore) {
            bestScore = 60;
            matchType = "keyword";
          }
        }
      }
    }

    // Description match (medium priority)
    if (item.description) {
      const descLower = item.description.toLowerCase();
      if (descLower.includes(normalizedQuery)) {
        if (50 > bestScore) {
          bestScore = 50;
          matchType = "description";
        }
      }
    }

    // Category match (lower priority)
    if (item.category) {
      const categoryLower = item.category.toLowerCase();
      if (categoryLower.includes(normalizedQuery)) {
        if (40 > bestScore) {
          bestScore = 40;
          matchType = "category";
        }
      }
    }

    if (bestScore > 0) {
      results.push({
        ...item,
        matchType,
        score: bestScore,
      });
    }
  }

  // Sort by score (highest first), then by title
  return results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.title.localeCompare(b.title);
  });
}

/**
 * Highlight matching text in a string
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
