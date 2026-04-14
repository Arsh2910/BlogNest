import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  clearStoredAuthUser,
  getStoredAuthId,
  getStoredAuthUser,
  getStoredAuthRole,
  setStoredAuthUser,
} from "../utils/authSession";

const featuredPosts = [
  {
    id: 1,
    title: "Designing For Slow Mornings: Building Calm Interfaces",
    excerpt:
      "A practical guide to reducing cognitive load in product layouts without sacrificing personality.",
    category: "Design",
    readTime: "7 min read",
  },
  {
    id: 2,
    title: "From Draft To Publish: A Reliable Writing Workflow",
    excerpt:
      "How to structure your article pipeline so ideas move from notebook to publication consistently.",
    category: "Workflow",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "A Better API Error Language For Teams",
    excerpt:
      "Turn cryptic backend failures into clear messages that engineers and users can act on fast.",
    category: "Backend",
    readTime: "9 min read",
  },
];

const trends = [
  "Writing Technical Posts That Non-Engineers Actually Read",
  "What Makes A Great Developer Portfolio In 2026",
  "Should You Keep Longform Content Inside Your Product?",
];

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function buildApiUrl(path) {
  return `${API_BASE}${path}`;
}

function toExcerpt(content) {
  const text = String(content || "")
    .replace(/<[^>]*>/g, "")
    .trim();

  if (!text) {
    return "No summary available for this post yet.";
  }

  if (text.length <= 130) {
    return text;
  }

  return `${text.slice(0, 127)}...`;
}

function toReadTime(content) {
  const words = String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function Home() {
  const navigate = useNavigate();
  const [apiPosts, setApiPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authUser, setAuthUser] = useState(() => getStoredAuthUser());
  const [authRole, setAuthRole] = useState(() => getStoredAuthRole());
  const [, setAuthUserId] = useState(() => getStoredAuthId());

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(buildApiUrl("/api/posts?limit=6"), {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setStatusMessage(
            "Sign in to load live posts. Showing starter stories for now.",
          );
          setApiPosts([]);
          return;
        }

        setStatusMessage(
          "Could not load posts right now. Showing starter stories.",
        );
        setApiPosts([]);
        return;
      }

      const payload = await response.json();
      setApiPosts(Array.isArray(payload.posts) ? payload.posts : []);
      setStatusMessage("");
    } catch {
      setStatusMessage(
        "Network issue while loading posts. Showing starter stories.",
      );
      setApiPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const mappedPosts = useMemo(() => {
    return apiPosts.map((post) => ({
      id: post._id || post.slug || post.title,
      title: post.title || "Untitled post",
      excerpt: toExcerpt(post.content),
      category: post.status === "published" ? "Published" : "Draft",
      readTime: toReadTime(post.content),
      slug: post.slug || "",
    }));
  }, [apiPosts]);

  const displayPosts =
    mappedPosts.length > 0 ? mappedPosts.slice(0, 3) : featuredPosts;

  const displayTrends =
    mappedPosts.length > 0
      ? mappedPosts.slice(0, 3).map((post) => post.title)
      : trends;

  async function handleLogin(event) {
    event.preventDefault();

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier || !password.trim()) {
      setAuthMessage("Username/email and password are required.");
      return;
    }

    const loginBody = {
      password,
      ...(trimmedIdentifier.includes("@")
        ? { email: trimmedIdentifier }
        : { username: trimmedIdentifier }),
    };

    try {
      setAuthBusy(true);
      setAuthMessage("");

      const response = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginBody),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAuthMessage(payload.message || "Login failed.");
        return;
      }

      const username = payload.username || trimmedIdentifier;
      setAuthUser(username);
      setAuthRole(payload.role || "user");
      setAuthUserId(payload.id || "");
      setStoredAuthUser(username, payload.role || "user", payload.id || "");
      setAuthMessage("Logged in successfully.");
      await loadPosts();
    } catch {
      setAuthMessage("Network issue while logging in.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    try {
      setAuthBusy(true);
      setAuthMessage("");

      const response = await fetch(buildApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        setAuthMessage("Could not log out right now.");
        return;
      }

      setAuthUser("");
      setAuthRole("");
      setAuthUserId("");
      clearStoredAuthUser();
      setAuthMessage("Logged out.");
      await loadPosts();
    } catch {
      setAuthMessage("Network issue while logging out.");
    } finally {
      setAuthBusy(false);
    }
  }

  function handleOpenPost(slug) {
    if (!slug) {
      return;
    }

    const detailPath = `/post/${slug}`;
    const openedWindow = window.open(
      detailPath,
      "_blank",
      "noopener,noreferrer",
    );

    // If popup is blocked by browser policy, fall back to same-tab navigation.
    if (!openedWindow) {
      navigate(detailPath);
    }
  }

  function handleSubmitStory() {
    if (authRole === "admin") {
      navigate("/upload-post");
      return;
    }

    navigate("/admin-profile");
  }

  function handleStartReading() {
    document
      .querySelector(".featured-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="home-page">
      <section className="hero-block">
        <p className="eyebrow">BlogNest Magazine</p>
        <h1>Stories for builders, thinkers, and curious teams.</h1>
        <p className="hero-copy">
          Explore practical writing on engineering, product systems, and digital
          craft. New articles arrive every week.
        </p>
        <div className="hero-actions">
          <button type="button" onClick={handleStartReading}>
            Start Reading
          </button>
          <button
            type="button"
            className="outline-btn"
            onClick={handleSubmitStory}
          >
            Submit a Story
          </button>
        </div>
      </section>

      <section
        className="content-grid"
        aria-label="Featured stories and trends"
      >
        <article className="featured-panel" aria-label="Featured stories">
          <header>
            <h2>Featured Stories</h2>
            <a href="#" onClick={(event) => event.preventDefault()}>
              View all
            </a>
          </header>

          {(isLoading || statusMessage) && (
            <p className="status-note" role="status" aria-live="polite">
              {isLoading ? "Loading posts..." : statusMessage}
            </p>
          )}

          <div className="post-list">
            {displayPosts.map((post) => (
              <article key={post.id} className="post-card">
                <p className="meta">
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </p>
                <button
                  type="button"
                  className="post-link"
                  onClick={() => handleOpenPost(post.slug)}
                  disabled={!post.slug}
                >
                  <h3>{post.title}</h3>
                </button>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        </article>

        <aside
          className="side-panel"
          aria-label="Popular topics and newsletter"
        >
          <div className="auth-box">
            <h2>{authUser ? "Signed In" : "Quick Login"}</h2>
            {authUser ? (
              <>
                <p className="auth-meta">Logged in as {authUser}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={authBusy}
                >
                  {authBusy ? "Working..." : "Log Out"}
                </button>
              </>
            ) : (
              <form className="auth-form" onSubmit={handleLogin}>
                <label htmlFor="identifier" className="sr-only">
                  Username or email
                </label>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="username or email"
                  autoComplete="username"
                />
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="password"
                  autoComplete="current-password"
                />
                <button type="submit" disabled={authBusy}>
                  {authBusy ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}
            {authMessage && <p className="auth-meta">{authMessage}</p>}
          </div>

          <div className="topic-box">
            <h2>Trending Now</h2>
            <ol>
              {displayTrends.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="newsletter-box">
            <h2>Weekly Dispatch</h2>
            <p>One practical email every Friday. No spam, only useful notes.</p>
            <form>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input id="email" type="email" placeholder="you@company.com" />
              <button type="submit">Join Newsletter</button>
            </form>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Home;
