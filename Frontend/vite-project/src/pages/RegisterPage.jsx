import { useState } from "react";
import "./AdminPages.css";
import { setStoredAuthUser } from "../utils/authSession";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function buildApiUrl(path) {
  return `${API_BASE}${path}`;
}

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch(buildApiUrl("/api/auth/register"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(payload.message || "Could not register right now.");
        return;
      }

      setMessage("Registration successful. You are now signed in.");
      setStoredAuthUser(
        payload.username || username,
        payload.role || "user",
        payload.id || "",
      );
      setUsername("");
      setEmail("");
      setPassword("");
    } catch {
      setMessage("Network issue while registering.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="form-page">
      <section className="form-card">
        <h1>Register</h1>
        <p>Create a BlogNest account to access user features.</p>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            minLength={3}
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </section>
    </main>
  );
}

export default RegisterPage;
