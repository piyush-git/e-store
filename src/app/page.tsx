export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">E-Store</h1>
      <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        A local shop account lives in this repo. Log in with the seed user, then
        log out from the header. The session is an httpOnly cookie checked
        against SQLite.
      </p>
    </main>
  );
}
