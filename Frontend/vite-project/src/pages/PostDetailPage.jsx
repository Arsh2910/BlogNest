import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./PostDetailPage.css";
import {
  getStoredAuthId,
  getStoredAuthRole,
  getStoredAuthUser,
  setStoredAuthUser,
} from "../utils/authSession";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function buildApiUrl(path) {
  return `${API_BASE}${path}`;
}

function toReadTime(content) {
  const words = String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function PostDetailPage() {
  const { slug } = useParams();
  const [authUser] = useState(() => getStoredAuthUser());
  const [authRole] = useState(() => getStoredAuthRole());
  const [authUserId, setAuthUserId] = useState(() => getStoredAuthId());

  const [detailPost, setDetailPost] = useState(null);
  const [detailBusy, setDetailBusy] = useState(true);
  const [detailError, setDetailError] = useState("");

  const [comments, setComments] = useState([]);
  const [commentsMessage, setCommentsMessage] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [coverMessage, setCoverMessage] = useState("");
  const [coverBusy, setCoverBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPostDetail() {
      if (!slug) {
        setDetailError("Post slug is missing.");
        setDetailBusy(false);
        return;
      }

      try {
        setDetailBusy(true);
        setDetailError("");

        const response = await fetch(buildApiUrl(`/api/posts/${slug}`), {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          setDetailPost(null);
          setDetailError(payload.message || "Could not load post details.");
          return;
        }

        setDetailPost(payload.post || null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setDetailPost(null);
          setDetailError("Network issue while loading this post.");
        }
      } finally {
        setDetailBusy(false);
      }
    }

    loadPostDetail();

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadComments() {
      if (!detailPost?._id) {
        setComments([]);
        setCommentsMessage("");
        return;
      }

      try {
        const response = await fetch(
          buildApiUrl(`/api/posts/${detailPost._id}/comments`),
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          },
        );

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          setComments([]);
          setCommentsMessage(payload.message || "Could not load comments.");
          return;
        }

        if (payload.currentUserId && !authUserId) {
          setAuthUserId(payload.currentUserId);
          setStoredAuthUser(
            authUser,
            authRole || payload.currentUserRole || "",
            payload.currentUserId,
          );
        }

        setComments(Array.isArray(payload.comments) ? payload.comments : []);
        setCommentsMessage(payload.message || "");
      } catch (error) {
        if (error.name !== "AbortError") {
          setComments([]);
          setCommentsMessage("Network issue while loading comments.");
        }
      }
    }

    loadComments();

    return () => controller.abort();
  }, [detailPost, authRole, authUser, authUserId]);

  function canDeleteComment(comment) {
    const authorId = comment?.author?._id || comment?.author;
    return authRole === "admin" || (authUserId && authorId === authUserId);
  }

  async function handleCreateComment(event) {
    event.preventDefault();

    if (!detailPost?._id) {
      return;
    }

    if (!commentText.trim()) {
      setCommentsMessage("Comment cannot be empty.");
      return;
    }

    try {
      setCommentBusy(true);
      setCommentsMessage("");

      const response = await fetch(
        buildApiUrl(`/api/posts/${detailPost._id}/comments`),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: commentText }),
        },
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setCommentsMessage(payload.message || "Could not create comment.");
        return;
      }

      setCommentText("");
      setComments((prev) => [...prev, payload.comment]);
      setCommentsMessage(payload.message || "Comment added successfully.");
    } catch {
      setCommentsMessage("Network issue while posting comment.");
    } finally {
      setCommentBusy(false);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!detailPost?._id) {
      return;
    }

    try {
      setCommentBusy(true);
      const response = await fetch(
        buildApiUrl(`/api/posts/${detailPost._id}/comments/${commentId}`),
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setCommentsMessage(payload.message || "Could not delete comment.");
        return;
      }

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
      setCommentsMessage(payload.message || "Comment deleted successfully.");
    } catch {
      setCommentsMessage("Network issue while deleting comment.");
    } finally {
      setCommentBusy(false);
    }
  }

  async function handleUploadCoverImage(event) {
    event.preventDefault();

    if (!detailPost?._id || !coverFile) {
      return;
    }

    try {
      setCoverBusy(true);
      setCoverMessage("");

      const formData = new FormData();
      formData.append("coverImage", coverFile);

      const response = await fetch(
        buildApiUrl(`/api/posts/${detailPost._id}/cover`),
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setCoverMessage(payload.message || "Could not upload cover image.");
        return;
      }

      setCoverMessage(payload.message || "Cover image uploaded successfully.");
      setCoverFile(null);
      setDetailPost((prev) =>
        prev ? { ...prev, coverImage: payload.coverImage } : prev,
      );
    } catch {
      setCoverMessage("Network issue while uploading cover image.");
    } finally {
      setCoverBusy(false);
    }
  }

  return (
    <main className="post-detail-page">
      <section className="post-detail-card">
        <header className="post-detail-header">
          <Link to="/" className="back-link">
            Back to Home
          </Link>
          <p className="viewer-chip">
            {authUser ? `Signed in as ${authUser}` : "Read mode"}
          </p>
        </header>

        {detailBusy && <p>Loading post details...</p>}

        {detailError && !detailBusy && (
          <p className="status-note">{detailError}</p>
        )}

        {detailPost && !detailBusy && (
          <article>
            <p className="meta-row">
              <span>{detailPost.status || "unknown"}</span>
              <span>{toReadTime(detailPost.content)}</span>
            </p>
            <h1>{detailPost.title}</h1>

            {detailPost.coverImage && (
              <img
                className="cover-preview"
                src={detailPost.coverImage}
                alt={detailPost.title}
              />
            )}

            <section className="comments-section">
              <h2>Comments</h2>
              {commentsMessage && (
                <p className="status-note">{commentsMessage}</p>
              )}
              <form className="comment-form" onSubmit={handleCreateComment}>
                <label htmlFor="detail-comment-text" className="sr-only">
                  Write a comment
                </label>
                <textarea
                  id="detail-comment-text"
                  rows={4}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Write your comment..."
                />
                <button type="submit" disabled={commentBusy}>
                  {commentBusy ? "Posting..." : "Add Comment"}
                </button>
              </form>

              <div className="comment-list">
                {comments.map((comment) => (
                  <article key={comment._id} className="comment-card">
                    <p className="comment-meta">
                      {comment.author?.username || "Anonymous"}
                    </p>
                    <p>{comment.content}</p>
                    {canDeleteComment(comment) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={commentBusy}
                      >
                        Delete
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <p className="post-content">{detailPost.content}</p>

            {authRole === "admin" && (
              <section className="comments-section">
                <h2>Upload Cover Image</h2>
                {coverMessage && <p className="status-note">{coverMessage}</p>}
                <form
                  className="comment-form"
                  onSubmit={handleUploadCoverImage}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setCoverFile(event.target.files?.[0] || null)
                    }
                  />
                  <button type="submit" disabled={coverBusy || !coverFile}>
                    {coverBusy ? "Uploading..." : "Upload Cover"}
                  </button>
                </form>
              </section>
            )}
          </article>
        )}
      </section>
    </main>
  );
}

export default PostDetailPage;
