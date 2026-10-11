"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabaseClient } from "../../lib/supabase";

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string>;
  ready: boolean;
  authError: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUser(user: SupabaseUser | null): User | null {
  if (!user) return null;

  const metadata = user.user_metadata as Record<string, unknown>;
  const appMetadata = user.app_metadata as Record<string, unknown>;
  const email = user.email ?? "";

  return {
    id: user.id,
    name: typeof metadata.name === "string" ? metadata.name : email.split("@")[0] || "User",
    email,
    isAdmin: appMetadata.role === "admin" || appMetadata.is_admin === true,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Supabase authentication is not configured.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    void Promise.resolve()
      .then(() => getSupabaseClient())
      .then((supabase) => {
        if (!active) return;
        const { data } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
          if (active) {
            setUser(toUser(session?.user ?? null));
            setReady(true);
          }
        });
        unsubscribe = () => data.subscription.unsubscribe();

        return supabase.auth.getSession().then(({ data: sessionData, error }) => {
          if (!active) return;
          if (error) setAuthError(error.message);
          setUser(toUser(sessionData.session?.user ?? null));
          setReady(true);
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuthError(errorMessage(error));
        setReady(true);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  async function login(email: string, password: string) {
    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function register(email: string, password: string, name: string) {
    const { error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
  }

  async function getAccessToken() {
    const { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw error;
    if (!data.session?.access_token) throw new Error("Sign in again to continue.");
    return data.session.access_token;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAccessToken, ready, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
