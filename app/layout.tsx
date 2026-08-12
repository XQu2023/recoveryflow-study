import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "RecoveryFlow | UK Powered Access Industry Conversation",
    description: "Help build the UK Powered Access Downtime Report 2026.",
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "What Really Causes Downtime?", description: "Join the UK Powered Access Industry Conversation.", images: [image] },
    twitter: { card: "summary_large_image", title: "What Really Causes Downtime?", description: "Join the UK Powered Access Industry Conversation.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
