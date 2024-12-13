import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Social Insights</h1>
        <p className="text-lg">
          This is a service that allows you to get insights from your social
          media accounts.
        </p>
        <Button>
          <Link href="/import">Get Started</Link>
        </Button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div>hello</div>
      </footer>
    </div>
  );
}
