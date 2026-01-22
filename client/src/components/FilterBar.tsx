import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function FilterBar({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}: FilterBarProps) {
  const categories = ["Todos", "Masculino", "Feminino", "Unissex"];

  return (
    <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input 
          type="text" 
          placeholder="Buscar perfume..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-none border-primary/20 bg-transparent pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "rounded-none border px-4 py-2 text-sm font-medium uppercase tracking-wider transition-all",
              selectedCategory === category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
