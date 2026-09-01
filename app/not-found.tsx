import Link from "next/link";
import { Container } from "@/components/primitives/section";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <Container className="flex flex-col items-center text-center">
        <p className="doto text-[10px] text-accent">Error 404</p>
        <h1 className="doto mt-6 text-[clamp(3rem,14vw,9rem)] leading-none font-semibold text-fg">
          404
        </h1>
        <p className="mt-6 max-w-[40ch] text-fg-muted">
          That route does not exist. Everything on this site lives on one page.
        </p>
        <Link
          href="/"
          className="doto mt-10 inline-flex h-12 items-center rounded-full bg-accent px-7 text-[11px] text-accent-fg transition-colors hover:bg-accent-hi"
        >
          Back to the start
        </Link>
      </Container>
    </main>
  );
}
