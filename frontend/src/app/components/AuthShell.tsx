import React from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

const AuthShell = ({ eyebrow, title, intro, children }: AuthShellProps) => (
  <div className="min-h-screen bg-stone-50">
    <main className="mx-auto max-w-lg px-4 py-12">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-950">{title}</h1>
        <p className="mt-3 text-stone-600">{intro}</p>
        {children}
      </section>
    </main>
  </div>
);

export default AuthShell;
