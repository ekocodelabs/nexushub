"use client";

import { useState } from "react";

import { Comment, Post } from "@/lib/types";

export default function FeedCardLayout({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comments, setComments] = useState<Comment[]>(post.comments ?? []);
  const [draft, setDraft] = useState("");

  const handleLikeToggle = () => {
    setLiked((current) => {
      const next = !current;
      setLikesCount((count) => count + (next ? 1 : -1));
      return next;
    });
  };

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = draft.trim();
    if (!trimmed) return;

    setComments((current) => [
      ...current,
      {
        id: `${post.id}-${Date.now()}`,
        authorName: "You",
        authorAvatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        content: trimmed,
        timeAgo: "just now",
      },
    ]);
    setDraft("");
  };

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {post.authorName}
              </h3>
              <p className="text-xs text-slate-500">{post.timeAgo}</p>
            </div>
          </div>

          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700">
            Members only
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {post.title}
          </h2>
          <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
            {post.content}
          </p>
        </div>

        {post.imageUrl && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src={post.imageUrl}
              alt="Post media content"
              className="h-72 w-full object-cover"
            />
          </div>
        )}

        <div className="mt-5 flex items-center gap-5 border-t border-slate-200 pt-4 text-sm text-slate-500">
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 rounded-full px-2.5 py-2 transition-colors ${
              liked
                ? "bg-red-50 text-red-600"
                : "hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <span className="text-base">{liked ? "❤️" : "🤍"}</span>
            <span className="font-medium">{likesCount}</span>
          </button>

          <div className="flex items-center gap-2 rounded-full px-2.5 py-2 hover:bg-slate-100 hover:text-slate-700">
            <span className="text-base">💬</span>
            <span className="font-medium">{comments.length}</span>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5">
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 rounded-2xl bg-slate-50 p-3"
              >
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {comment.authorName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
