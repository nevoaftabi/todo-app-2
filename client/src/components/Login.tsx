import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const API = "http://localhost:3000";
type LocationState = {
  from?: {
    pathname: string;
  };
};
export default function Login() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const location = useLocation();
  const { refresh } = useAuth();

  const from = (location.state as LocationState | null)?.from?.pathname ?? "/";

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");

        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          setError("Login failed");
          return;
        }

        await refresh(); // updates user in context
        nav(from, { replace: true });
      }}
    >
      <h1>Login</h1>
      <div>{error}</div>

      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign in</button>
    </form>
  );
}
