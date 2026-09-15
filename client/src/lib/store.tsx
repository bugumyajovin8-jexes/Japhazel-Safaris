import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";

interface User {
  id: string; // Supabase uses UUID strings
  email: string;
  name?: string;
  role: "admin";
}

/**
 * "unconfigured" is distinct from "wrong password" — they need different fixes.
 * Written as one optional-field shape rather than a discriminated union because
 * this project compiles without `strict`, and narrowing on a boolean
 * discriminant does not work with strictNullChecks disabled.
 */
export interface LoginResult {
  ok: boolean;
  reason?: "unconfigured" | "invalid" | "error";
  message?: string;
}

interface StoreContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  /** False when the Supabase env vars are missing, so login cannot work at all. */
  authConfigured: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    if (!supabase) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: "admin"
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            role: "admin"
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    // Without the Supabase env vars the client is null and every attempt would
    // read as a wrong password. Say what is actually wrong instead.
    if (!supabase) {
      return {
        ok: false,
        reason: "unconfigured",
        message:
          "Admin sign-in is not configured. Set VITE_SUPABASE_URL and " +
          "VITE_SUPABASE_ANON_KEY, then rebuild. See DATABASE.md.",
      };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { ok: false, reason: "invalid", message: "Invalid email or password." };
      }
      await checkAuth();
      return { ok: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        ok: false,
        reason: "error",
        message: "Could not reach the authentication service. Please try again.",
      };
    }
  };

  const logout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        login,
        authConfigured: Boolean(supabase),
        logout,
        checkAuth,
        loading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
