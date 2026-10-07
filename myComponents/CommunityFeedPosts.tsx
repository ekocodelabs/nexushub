"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import type { Post } from "@/lib/types";
import FeedCardLayout from "@/myComponents/FeedCardLayout";

type ApiPost = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author_name: string;
  author_avatar: string | null;
  created_at: string;
};

function formatTimeAgo(value: string) {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 60_000),
  );

  if (elapsedMinutes < 1) return "just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

function toFeedPost(post: ApiPost): Post {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.image_url ?? undefined,
    authorName: post.author_name,
    authorAvatar:
      post.author_avatar ??
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    timeAgo: formatTimeAgo(post.created_at),
    likesCount: 0,
    comments: [],
  };
}

export default function CommunityFeedPosts({
  communityId,
  canPost,
}: {
  communityId: string;
  canPost: boolean;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setError("");
    try {
      const response = await fetch(
        `/api/posts?community_id=${encodeURIComponent(communityId)}`,
        { cache: "no-store" },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Could not load community posts.");
      }
      setPosts((result.data as ApiPost[]).map(toFeedPost));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load community posts.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsPublishing(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          image_url: imageUrl || null,
          community_id: communityId,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.details ?? result.error ?? "Could not publish post.",
        );
      }

      setTitle("");
      setContent("");
      setImageUrl("");
      await loadPosts();
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Could not publish post.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {canPost ? (
        <form
          onSubmit={handlePublish}
          className="space-y-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Create a post
          </h2>
          <input
            required
            maxLength={160}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Post title"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400"
          />
          <textarea
            required
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share something with the community..."
            className="h-28 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
          />
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Image URL (optional)"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPublishing}
              className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPublishing ? "Publishing…" : "Publish post"}
            </button>
          </div>
        </form>
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Sign in as a community member or creator to publish a post.
        </p>
      )}

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading posts…</p>
      ) : posts.length ? (
        posts.map((post) => <FeedCardLayout key={post.id} post={post} />)
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          No posts yet. Be the first to share something.
        </p>
      )}
    </div>
  );
}
