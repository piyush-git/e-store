import Link from "next/link";
import { Suspense } from "react";
import { AccountMenu } from "@/components/account-menu";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        E-Store
      </Link>
      <Suspense
        fallback={<span className="text-sm text-zinc-500">Account…</span>}
      >
        <AccountMenu />
      </Suspense>
    </header>
  );
}
