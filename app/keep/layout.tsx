import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Powered Access Recovery Study 2026 | RecoveryFlow",
  description: "Share one real downtime experience and help the UK powered access industry get machines back to work faster.",
};

export default function KeepLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
