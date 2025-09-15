"use client";

import { Input } from "@/components/ui/input";
import { useSearchProducts } from "@/hooks/tanstack/product-variants";
import { useDebounce } from "@/hooks/use-debounce";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import SearchResultItem from "./search-result-item";

const SearchProduct = () => {
  const [hasFocus, setHasFocus] = useState<boolean>(false);

  const [searchKeyword, setSearchKeyword] = useState<string | null>(null);
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const { isPending, products } = useSearchProducts(debouncedKeyword || "");

  return (
    <div className="relative">
      <Input
        className="peer h-8 ps-9 pe-9 2xl:h-10"
        placeholder="Search for products..."
        type="search"
        value={searchKeyword || ""}
        onChange={(event) => setSearchKeyword(event.target.value)}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setTimeout(() => setHasFocus(false), 300)}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Submit search"
        type="submit"
      >
        <ArrowRightIcon size={16} aria-hidden="true" />
      </button>

      {!!searchKeyword && hasFocus && (
        <div className="bg-background absolute z-10 mt-2 w-full space-y-2 border shadow-2xl">
          {isPending ? (
            <div className="animate-pulse px-5 py-6 text-center text-gray-500">
              <p className="text-sm">🔍 Searching for products...</p>
            </div>
          ) : products?.data?.length === 0 ? (
            <div className="px-5 py-6 text-center text-gray-500">
              <p className="text-sm">🙁 No matching products found.</p>
              <p className="mt-1 text-xs text-gray-400">
                Try another keyword or check spelling.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <h1 className="flex items-center gap-2 bg-neutral-100 px-5 py-3 text-sm font-medium text-zinc-700">
                <ArrowRightIcon size={16} className="text-rose-500" />
                <span>
                  Search results for{" "}
                  <span className="text-foreground font-semibold">
                    {debouncedKeyword}
                  </span>
                </span>
              </h1>

              <div className="max-h-[38dvh] divide-y overflow-y-scroll">
                {products?.data?.map((variant, index) => (
                  <SearchResultItem key={index} variant={variant} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
