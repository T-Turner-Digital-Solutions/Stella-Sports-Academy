import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Board Portal",
    template: "%s | Stellar Board Portal",
  },
  robots: { index: false, follow: false },
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
