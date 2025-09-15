"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tag, TagInput } from "emblor";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Product } from "../product-schema";

interface ProductVariantManualProps {
  isFormSubmitting: boolean;
  mode?: "create" | "edit";
}

export const ProductVariantManual = ({
  isFormSubmitting,
  mode = "create",
}: ProductVariantManualProps) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const form = useFormContext<Product>();

  const helpers = useFieldArray({
    control: form.control,
    name: "productVariantHelpers",
  });

  const variants = useFieldArray({
    control: form.control,
    name: "productVariants",
  });

  // ⬇️ Utility to generate cartesian product
  const generateCombinations = (
    helpers: { key: string; values: string[] }[],
  ): { attribute: string; value: string; skuSuffix: string }[] => {
    if (helpers.length === 0) return [];

    const keys = helpers.map((h) => h.key);
    const valueSets = helpers.map((h) => h.values);

    const cartesian = (arr: string[][]): string[][] =>
      arr.reduce<string[][]>(
        (a, b) => a.flatMap((x) => b.map((y) => [...x, y])),
        [[]],
      );

    const combinations = cartesian(valueSets);

    return combinations.map((combo) => {
      // Generate SKU suffix by taking first letters or first 3 characters of each value
      const skuParts = combo.map((value) => {
        // Remove special characters and spaces
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
        // Take first 3 characters or full if shorter
        return cleaned.slice(0, 3).toUpperCase();
      });

      return {
        attribute: keys.join("-"),
        value: combo.join("-"),
        skuSuffix: skuParts.join("-"),
      };
    });
  };

  return (
    <div className="flex items-start gap-4 rounded-md border p-5">
      {/* Left column: Helpers */}
      {mode === "create" && (
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold">Variant Attributes</h2>

          {helpers.fields.map((field, index) => (
            <div key={field.id} className="space-y-4 rounded-md border p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`productVariantHelpers.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attribute Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. size"
                          {...field}
                          disabled={isFormSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`productVariantHelpers.${index}.values`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Values</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={(field.value ?? []).map((value) => ({
                            id: value,
                            text: value,
                          }))}
                          setTags={(newTags) => {
                            const updatedTags = newTags as Tag[];
                            field.onChange(updatedTags.map((tag) => tag.text));
                          }}
                          placeholder="Add a value"
                          styleClasses={{
                            inlineTagsContainer:
                              "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                            input: "w-full min-w-[80px] shadow-none px-2 h-7",
                            tag: {
                              body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                              closeButton:
                                "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                            },
                          }}
                          activeTagIndex={activeTagIndex}
                          setActiveTagIndex={setActiveTagIndex}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => helpers.remove(index)}
                disabled={isFormSubmitting}
              >
                <Trash2Icon className="h-4 w-4" />
                Remove Attribute
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => helpers.append({ key: "", values: [] })}
              disabled={isFormSubmitting}
            >
              Add Attribute
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={() => {
                const helpersData = form.getValues("productVariantHelpers");
                const combos = generateCombinations(helpersData!);

                variants.replace(
                  combos.map((combo) => ({
                    id: undefined,
                    attribute: combo.attribute,
                    value: combo.value,
                    skuSuffix: combo.skuSuffix, // Use the generated SKU suffix
                    barcode: null,
                    additionalPrice: 0,
                    sellingPrice: 0,
                    quantity: 0,
                    minStockLevel: 0,
                    image: "",
                  })),
                );
              }}
              disabled={isFormSubmitting || helpers.fields.length === 0}
            >
              Generate Variants
            </Button>
          </div>
        </div>
      )}

      {/* Right column: Variants */}
      <div className="flex-1 space-y-4">
        <h2 className="text-lg font-semibold">Product Variants</h2>

        {variants.fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-md border p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: "Attribute Combination", name: "attribute" as const },
                { label: "Value Combination", name: "value" as const },
                { label: "SKU Suffix", name: "skuSuffix" as const },
                {
                  label: "Barcode",
                  name: "barcode" as const,
                  transformValue: (value: string | null) => value ?? "", // handle null cases
                },
                {
                  label: "Additional Price",
                  name: "additionalPrice" as const,
                  type: "number",
                },
                {
                  label: "Selling Price",
                  name: "sellingPrice" as const,
                  type: "number",
                },
                {
                  label: "Quantity",
                  name: "quantity" as const,
                  type: "number",
                },
                {
                  label: "Min Stock Level",
                  name: "minStockLevel" as const,
                  type: "number",
                },
              ].map((fieldInfo) => {
                // Get the current field value
                const fieldValue = form.watch(
                  `productVariants.${index}.${fieldInfo.name}`,
                );

                const inputValue =
                  fieldValue === null
                    ? ""
                    : fieldValue === undefined
                      ? ""
                      : fieldValue;

                return (
                  <FormField
                    key={fieldInfo.name}
                    control={form.control}
                    name={`productVariants.${index}.${fieldInfo.name}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldInfo.label}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={fieldInfo.type ?? "text"}
                            disabled={isFormSubmitting}
                            value={inputValue}
                            onChange={(e) => {
                              if (fieldInfo.name === "barcode") {
                                field.onChange(
                                  e.target.value === "" ? null : e.target.value,
                                );
                              } else if (fieldInfo.type === "number") {
                                // handle number fields
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                                );
                              } else {
                                // handle regular string fields
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => variants.remove(index)}
              disabled={isFormSubmitting}
            >
              <Trash2Icon className="h-4 w-4" />
              Remove Variant
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            variants.append({
              id: undefined,
              attribute: "",
              value: "",
              skuSuffix: "",
              barcode: null,
              additionalPrice: 0,
              sellingPrice: 0,
              quantity: 0,
              minStockLevel: 0,
              image: "",
            })
          }
          disabled={isFormSubmitting}
        >
          Add Variant
        </Button>
      </div>
    </div>
  );
};

export default ProductVariantManual;
