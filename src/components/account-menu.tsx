import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

export async function AccountMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-600 dark:text-zinc-300">
        {user.name}
      </span>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/15"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
