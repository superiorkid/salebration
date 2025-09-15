import { TUser } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getVariantCombinations = (
  helpers: { key: string; values: string[] }[] = [],
): string[] => {
  const filtered = helpers.filter(
    (item) => item.values && item.values.length > 0,
  );

  return filtered.reduce<string[]>((acc, curr) => {
    if (acc.length === 0) return curr.values;

    const combinations: string[] = [];
    for (const a of acc) {
      for (const b of curr.values) {
        combinations.push(`${a}-${b}`);
      }
    }
    return combinations;
  }, []);
};

export const isValidUrl = (s: string, protocols?: string[]): boolean => {
  try {
    const url = new URL(s);
    if (protocols) {
      return protocols.map((p) => `${p.toLowerCase()}:`).includes(url.protocol);
    }
    return true;
  } catch {
    return false;
  }
};
export const getFileNameFromUrl = (url: string) => {
  return url.split("/").pop();
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (value: number) => {
  const numericValue = Number(value);

  return new Intl.NumberFormat("id-ID", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(numericValue / 100);
};

export const hasPermission = (
  user: TUser | null,
  permission: string,
): boolean => {
  if (!user) return false;
  const allPermissions =
    user.roles?.flatMap((role) =>
      role.permissions.map((permission) => permission.name),
    ) ?? [];

  return allPermissions.includes(permission);
};

export const buildExportUrl = (params: {
  mode: "csv" | "excel";
  path: string;
  baseUrl: string;
  searchParams: Record<
    string,
    string | number | boolean | Date | undefined | null
  >;
}) => {
  const { mode, path, searchParams, baseUrl } = params;
  const urlParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(
        key,
        value instanceof Date ? value.toISOString() : String(value),
      );
    }
  });
  urlParams.append("mode", mode);

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}?${urlParams.toString()}`;
};
