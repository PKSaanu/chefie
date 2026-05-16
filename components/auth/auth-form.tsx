"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthActionState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    prev: AuthActionState,
    formData: FormData
  ) => Promise<AuthActionState>;
};

const initialState: AuthActionState = {};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const isLogin = mode === "login";

  return (
    <form action={formAction} className="w-full max-w-md space-y-5">
      {!isLogin && (
        <Field label="Display name" id="username" name="username" type="text" />
      )}

      <Field
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <Field
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete={isLogin ? "current-password" : "new-password"}
        required
        hint={!isLogin ? "At least 6 characters" : undefined}
      />

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
          {state.success}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
      </Button>

      <p className="text-center text-sm text-chefie-muted">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-chefie-primary hover:text-chefie-primary-dark"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-chefie-primary hover:text-chefie-primary-dark"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  name,
  type,
  autoComplete,
  required,
  hint,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-chefie-text">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-stone-200 bg-chefie-surface px-4 py-3 text-chefie-text outline-none transition-shadow placeholder:text-stone-400 focus:border-chefie-primary focus:ring-2 focus:ring-chefie-primary/25"
      />
      {hint && <p className="text-xs text-chefie-muted">{hint}</p>}
    </div>
  );
}
