import { useState } from "react";
import "./AdminPages.css";
import { setStoredAuthUser } from "../utils/authSession";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function buildApiUrl(path) {
  return `${API_BASE}${path}`;
}

function AdminProfilePage() {
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
        body: JSON.stringify({
          username,
          email,
          password,
          role: "admin",
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(payload.message || "Could not create admin profile.");
        return;
      }

      setMessage("Admin profile created and logged in.");
      setStoredAuthUser(
        payload.username || username,
        payload.role || "admin",
        payload.id || "",
      );
      setUsername("");
      setEmail("");
      setPassword("");
    } catch {
      setMessage("Network issue while creating admin profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="form-page">
      <section className="form-card">
        <h1>Create Admin Profile</h1>
        <p>This submits a register request with role set to admin.</p>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-username">Admin username</label>
          <input
            id="admin-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            minLength={3}
          />

          <label htmlFor="admin-email">Admin email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating admin..." : "Create Admin"}
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </section>
    </main>
  );
}

export default AdminProfilePage;
