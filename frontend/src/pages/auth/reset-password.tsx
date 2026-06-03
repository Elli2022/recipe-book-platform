import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ResetPasswordModal from "@/app/components/ResetPasswordModal";
import { getSupabaseBrowserClient, hasSupabaseConfig } from "@/lib/supabaseClient";

const ResetPasswordPage = () => {
  const router = useRouter();
  const supabaseConfigured = hasSupabaseConfig();
  const [ready, setReady] = useState(!supabaseConfigured);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(
    supabaseConfigured ? null : "Supabase Auth är inte konfigurerad."
  );
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    const openFromHash = async () => {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : "";
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (type === "recovery" && accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          setError(sessionError.message);
          setReady(true);
          return;
        }

        window.history.replaceState({}, document.title, window.location.pathname);
        setModalOpen(true);
        setReady(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setModalOpen(true);
      }

      setReady(true);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setModalOpen(true);
        setError(null);
      }
    });

    void openFromHash();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseConfigured]);

  const onSuccess = async () => {
    setCompleted(true);
    setModalOpen(false);
    await getSupabaseBrowserClient().auth.signOut();
    setTimeout(() => {
      router.replace("/login?reset=1");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-12">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Lösenord
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">Återställ lösenord</h1>

          {!ready ? (
            <p className="mt-3 text-stone-600">Verifierar länken...</p>
          ) : completed ? (
            <p className="mt-5 rounded-md bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              Lösenordet är uppdaterat. Skickar dig till inloggning...
            </p>
          ) : error ? (
            <>
              <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
              <p className="mt-6 text-sm text-stone-600">
                <Link href="/forgot-password" className="font-semibold text-emerald-700">
                  Begär en ny återställningslänk
                </Link>
              </p>
            </>
          ) : modalOpen ? (
            <p className="mt-3 text-stone-600">
              Fyll i ditt nya lösenord i rutan som öppnades.
            </p>
          ) : (
            <>
              <p className="mt-3 text-stone-600">
                Länken är ogiltig eller har gått ut. Begär en ny återställning via e-post.
              </p>
              <p className="mt-6 text-sm text-stone-600">
                <Link href="/forgot-password" className="font-semibold text-emerald-700">
                  Skicka ny återställningslänk
                </Link>
              </p>
            </>
          )}
        </section>
      </main>

      <ResetPasswordModal
        open={modalOpen && !completed}
        onClose={() => setModalOpen(false)}
        onSuccess={() => void onSuccess()}
      />

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
