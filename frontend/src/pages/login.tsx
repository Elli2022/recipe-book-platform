import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AuthShell from "@/app/components/AuthShell";
import { useRouter } from "next/router";
import { notifyAuthChange } from "@/lib/auth/local-user";

const inputClassName =
  "rounded-md border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const nextPath =
    typeof router.query.next === "string" ? router.query.next : "/recept";

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || data.message || "Inloggningen misslyckades.");
      }

      localStorage.setItem("receptbok.user", JSON.stringify(data.user));
      notifyAuthChange();
      router.push(nextPath);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Inloggningen misslyckades. Kontrollera dina uppgifter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <AuthShell
        eyebrow="Välkommen tillbaka"
        title="Logga in"
        intro="Logga in för att spara favoriter och synka recept mellan enheter."
      >
        {error && (
          <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            E-post
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              autoComplete="email"
              className={inputClassName}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Lösenord
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              autoComplete="current-password"
              className={inputClassName}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-600">
          Inget konto?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(nextPath)}`}
            className="font-semibold text-emerald-700"
          >
            Skapa konto
          </Link>
        </p>
      </AuthShell>
      <Footer />
    </div>
  );
};

export default Login;
