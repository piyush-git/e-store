import { Suspense } from "react";
import { logout } from "@/app/actions/auth";
import { LoginForm } from "@/app/login/login-form";
import { getCurrentUser } from "@/lib/auth";
import { seedUser } from "@/lib/seed";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Sign in with the account stored in this app.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <LoginGate />
        </Suspense>
      </div>
    </main>
  );
}

async function LoginGate() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/15">
        <p>
          You are signed in as <span className="font-medium">{user.name}</span>.
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background"
          >
            Log out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <LoginForm />
      <p className="rounded-xl bg-black/[.04] px-4 py-3 text-sm leading-6 text-zinc-600 dark:bg-white/[.06] dark:text-zinc-300">
        Seed account: {seedUser.email}
        <br />
        Password: {seedUser.password}
      </p>
    </div>
  );
}
