import { Toaster } from "@/components/ui/sonner";
import CustomerFormProvider from "@/context/customer-form-context";
import { PosSessionProvider } from "@/context/pos-session-context";
import ValidateReorderDataProvider from "@/context/validate-reorder-data-context";
import { env } from "@/env";
import { ReactScan } from "@/lib/react-scan";
import { cn } from "@/lib/utils";
import QueryClientProvider from "@/providers/query-client-provider";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: env.APP_NAME,
    template: `%s | ${env.APP_NAME}`,
  },
  description: `${env.APP_NAME} is an all-in-one Point on Sale  and Inventory Management system designed to streamline your business operations`,
  keywords: [
    "Point of Sale",
    "Inventory Management",
    "POS System",
    "Business App",
    "Kasir",
    "Stok Barang",
  ],
  generator: "Next.js",
  authors: [{ name: env.APP_NAME }],
  applicationName: env.APP_NAME,
  referrer: "origin-when-cross-origin",
  metadataBase: new URL(env.APP_DOMAIN),
  openGraph: {
    title: env.APP_NAME,
    description: `${env.APP_NAME} simplifies sales and stock tracking in one powerful platform.`,
    url: env.APP_DOMAIN,
    siteName: env.APP_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: env.APP_NAME,
    description: `${env.APP_NAME} combines POS and Inventory tools in one app.`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `bg-background min-h-screen antialiased xl:px-0`,
          geistMono.className,
        )}
      >
        <ReactScan />
        <QueryClientProvider>
          <NuqsAdapter>
            <PosSessionProvider>
              <CustomerFormProvider>
                <ValidateReorderDataProvider>
                  {children}
                </ValidateReorderDataProvider>
              </CustomerFormProvider>
            </PosSessionProvider>
          </NuqsAdapter>
        </QueryClientProvider>
        <Toaster richColors theme="system" expand={false} />
      </body>
    </html>
  );
}
