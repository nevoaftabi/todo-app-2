import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; email: string };
type AuthState = { user: User | null; loading: boolean };

const AuthCtx = createContext<AuthState>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/me", {
          credentials: "include", // for cookie sessions
        });
        if (!res.ok) {
          setUser(null);
        } else {
          setUser(await res.json());
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
