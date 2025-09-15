"use client";

import { usePosSession } from "@/context/pos-session-context";
import { formatCurrency } from "@/lib/utils";
import { TProductVariant } from "@/types/product-variant";
import Image from "next/image";

interface SearchResultItemProps {
  variant: TProductVariant;
}

const SearchResultItem = ({ variant }: SearchResultItemProps) => {
  const { addItem } = usePosSession();

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-rose-50"
      onClick={() => addItem(variant)}
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-white">
        <Image
          fill
          alt={`${variant.product.name} ${variant.value} image`}
          src={variant.product.image}
          className="object-cover"
          loading="lazy"
          quality={65}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-semibold text-rose-700">
          {formatCurrency(variant.selling_price)}
        </p>
        <p className="text-zinc-700">
          {variant.product.name}{" "}
          <span className="font-normal text-zinc-500">{variant.value}</span>
        </p>
      </div>

      <div className="ml-auto text-right text-xs text-zinc-500">
        Qty:{" "}
        <span className="text-foreground font-semibold">
          {variant.quantity}
        </span>
      </div>
    </div>
  );
};

export default SearchResultItem;
