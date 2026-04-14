import { useEffect, useState } from "react";
import "./AdminPages.css";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function buildApiUrl(path) {
  return `${API_BASE}${path}`;
}

function UploadPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [tagsMessage, setTagsMessage] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTags() {
      try {
        const response = await fetch(buildApiUrl("/api/tags"), {
          method: "GET",
          credentials: "include",
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (isMounted) {
            setTagsMessage(payload.message || "Could not load tags.");
          }
          return;
        }

        if (isMounted) {
          setAvailableTags(Array.isArray(payload.tags) ? payload.tags : []);
          setTagsMessage("");
        }
      } catch {
        if (isMounted) {
          setTagsMessage("Network issue while loading tags.");
        }
      }
    }

    loadTags();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleTagToggle(tagId) {
    setSelectedTagIds((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      return [...prev, tagId];
    });
  }

  async function handleCreateTag() {
    const trimmedName = newTagName.trim();
    if (!trimmedName) {
      setTagsMessage("Tag name is required.");
      return;
    }

    try {
      setIsCreatingTag(true);
      setTagsMessage("");

      const response = await fetch(buildApiUrl("/api/tags"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setTagsMessage(payload.message || "Could not create tag.");
        return;
      }

      const createdTag = payload.tag;
      if (createdTag && createdTag._id) {
        setAvailableTags((prev) => {
          const exists = prev.some((tag) => tag._id === createdTag._id);
          return exists ? prev : [...prev, createdTag];
        });
        setSelectedTagIds((prev) =>
          prev.includes(createdTag._id) ? prev : [...prev, createdTag._id],
        );
      }

      setNewTagName("");
      setTagsMessage(payload.message || "Tag created successfully.");
    } catch {
      setTagsMessage("Network issue while creating tag.");
    } finally {
      setIsCreatingTag(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      title,
      content,
      status,
    };

    if (selectedTagIds.length > 0) {
      payload.tags = selectedTagIds;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch(buildApiUrl("/api/posts"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(responsePayload.message || "Could not upload post.");
        return;
      }

      const createdPost = responsePayload.data;

      if (coverImage && createdPost?._id) {
        const formData = new FormData();
        formData.append("coverImage", coverImage);

        const coverResponse = await fetch(
          buildApiUrl(`/api/posts/${createdPost._id}/cover`),
          {
            method: "POST",
            credentials: "include",
            body: formData,
          },
        );

        const coverPayload = await coverResponse.json().catch(() => ({}));

        if (!coverResponse.ok) {
          setMessage(
            `${responsePayload.message || "Post uploaded."} Cover upload failed: ${
              coverPayload.message || "unknown error"
            }`,
          );
        } else {
          setMessage("Post uploaded successfully with cover image.");
        }
      } else {
        setMessage("Post uploaded successfully.");
      }

      setTitle("");
      setContent("");
      setStatus("draft");
      setSelectedTagIds([]);
      setCoverImage(null);
    } catch {
      setMessage("Network issue while uploading post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="form-page">
      <section className="form-card">
        <h1>Upload Blog Post</h1>
        <p>Use an admin account to publish a new blog post.</p>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            minLength={3}
          />

          <label htmlFor="post-content">Content</label>
          <textarea
            id="post-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            minLength={20}
            rows={8}
          />

          <label htmlFor="post-status">Status</label>
          <select
            id="post-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <fieldset className="tags-picker">
            <legend>Tags (optional)</legend>
            {tagsMessage && <p className="inline-note">{tagsMessage}</p>}
            <div className="tag-create-row">
              <input
                type="text"
                value={newTagName}
                onChange={(event) => setNewTagName(event.target.value)}
                placeholder="Create new tag (e.g. react)"
              />
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCreateTag}
                disabled={isCreatingTag}
              >
                {isCreatingTag ? "Creating..." : "Add Tag"}
              </button>
            </div>
            {!tagsMessage && availableTags.length === 0 && (
              <p className="inline-note">
                No tags found. Create tags from backend first.
              </p>
            )}
            <div className="tags-grid">
              {availableTags.map((tag) => (
                <label key={tag._id} className="tag-item">
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag._id)}
                    onChange={() => handleTagToggle(tag._id)}
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="post-cover">Cover Image</label>
          <input
            id="post-cover"
            type="file"
            accept="image/*"
            onChange={(event) => setCoverImage(event.target.files?.[0] || null)}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Post"}
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </section>
    </main>
  );
}

export default UploadPostPage;
