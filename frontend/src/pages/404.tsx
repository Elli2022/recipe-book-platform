import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Custom404() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-stone-950">Sidan hittades inte</h1>
        <p className="mt-4 text-stone-600">
          Länken kan vara felaktig eller receptet kan ha tagits bort.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/recept"
            className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Till receptbiblioteket
          </Link>
          <Link
            href="/"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800"
          >
            Till startsidan
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
