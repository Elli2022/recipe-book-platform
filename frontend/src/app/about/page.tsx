import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Om projektet",
  description:
    "Varför Receptbok skapades — gluten- och nötfria recept samlade med favoriter, kategorier och PWA.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <section className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Om projektet
          </p>
          <h1 className="mt-2 text-4xl font-bold text-stone-950">Varför Receptbok?</h1>
          <p className="mt-5 text-lg leading-8 text-stone-700">
            Jag ville samla gluten- och nötfria recept på ett ställe — med tydliga steg,
            ingredienser i rätt ordning och en upplevelse som fungerar lika bra på mobil
            som desktop.
          </p>
          <p className="mt-4 leading-8 text-stone-700">
            Tidigare låg recepten utspridda över sociala medier, pappersböcker och olika
            webbplatser. Receptbok samlar dem i ett sökbar bibliotek med favoriter,
            kategorier och stöd för både gäster och inloggade användare.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-stone-50 p-4">
              <p className="font-semibold text-stone-950">Tydliga steg</p>
              <p className="mt-2 text-sm text-stone-600">
                Instruktioner och ingredienser hänger ihop visuellt.
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 p-4">
              <p className="font-semibold text-stone-950">Favoriter</p>
              <p className="mt-2 text-sm text-stone-600">
                Spara recept du vill laga om och om igen.
              </p>
            </div>
            <div className="rounded-xl bg-stone-50 p-4">
              <p className="font-semibold text-stone-950">PWA-ready</p>
              <p className="mt-2 text-sm text-stone-600">
                Lägg till på hemskärmen för snabb åtkomst i köket.
              </p>
            </div>
          </div>
          <p className="mt-8 text-sm text-stone-600">
            <Link href="/recept" className="font-semibold text-emerald-700">
              Utforska receptbiblioteket
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
