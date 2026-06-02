import React, { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { authButtonClassName, authInputClassName } from "@/lib/auth/input-styles";

type ResetPasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const ResetPasswordModal = ({ open, onClose, onSuccess }: ResetPasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken.");
      return;
    }

    if (password !== password2) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await getSupabaseBrowserClient().auth.updateUser({
        password,
      });

      if (updateError) {
        throw new Error(updateError.message || "Kunde inte uppdatera lösenordet.");
      }

      setPassword("");
      setPassword2("");
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Kunde inte uppdatera lösenordet."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Nytt lösenord
        </p>
        <h2 id="reset-password-title" className="mt-2 text-2xl font-bold text-stone-950">
          Välj ett nytt lösenord
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Skriv lösenordet två gånger för att bekräfta.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Nytt lösenord
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={authInputClassName}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Bekräfta lösenord
            <input
              type="password"
              value={password2}
              onChange={(event) => setPassword2(event.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={authInputClassName}
            />
          </label>
          <button type="submit" disabled={loading} className={authButtonClassName}>
            {loading ? "Sparar..." : "Spara nytt lösenord"}
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-sm font-medium text-stone-600 transition hover:text-stone-950"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
