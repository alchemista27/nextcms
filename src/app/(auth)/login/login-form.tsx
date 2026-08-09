"use client";

import { useState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
    }
    setPending(false);
  }

  return (
    <div className="bg-surface w-full max-w-[440px] rounded-xl p-10 shadow-xl">
      <div className="text-center mb-8">
        <div className="text-primary text-5xl mb-3 material-icons-outlined">
          hub
        </div>
        <h1 className="text-primary-dark text-2xl font-bold tracking-tight">
          NextCMS
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Sign in to your account
        </p>
      </div>

      <form action={handleSubmit}>
        <div className="mb-5 relative">
          <label className="block mb-2 text-text-primary font-medium text-sm">
            Email
          </label>
          <div className="relative flex items-center">
            <span className="material-icons-outlined absolute left-3 text-text-secondary text-xl">
              mail
            </span>
            <input
              type="email"
              name="email"
              required
              placeholder="Masukkan email Anda"
              className="w-full py-3 pl-10 pr-3 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <div className="mb-6 relative">
          <label className="block mb-2 text-text-primary font-medium text-sm">
            Password
          </label>
          <div className="relative flex items-center">
            <span className="material-icons-outlined absolute left-3 text-text-secondary text-xl">
              lock
            </span>
            <input
              type="password"
              name="password"
              required
              placeholder="Masukkan password Anda"
              className="w-full py-3 pl-10 pr-3 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            <span className="material-icons-outlined absolute right-3 text-text-secondary text-xl cursor-pointer hover:text-primary transition-colors">
              visibility
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
            <input type="checkbox" className="accent-primary w-4 h-4 cursor-pointer" defaultChecked />
            Remember me
          </label>
          <a href="#" className="text-primary font-medium hover:underline">
            Forgot password?
          </a>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 bg-primary text-white font-semibold text-base rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {pending ? "Signing In..." : "Sign In"}
        </button>
      </form>
      
      <div className="flex items-center text-center my-6 text-text-secondary text-sm before:flex-1 before:border-b before:border-border before:mr-2 after:flex-1 after:border-b after:border-border after:ml-2">
        or
      </div>
      
      <div className="text-center text-sm text-text-secondary">
        Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Register</a>
      </div>
      
      <div className="text-center mt-8 text-text-secondary text-xs">
        &copy; 2026 NextCMS
      </div>
    </div>
  );
}
