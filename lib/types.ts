export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  title: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  comments: Comment[];
}

export const DUMMY_POSTS: Post[] = [
  {
    id: "1",
    authorName: "Tunde (Crypto Alpha)",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    timeAgo: "10 minutes ago",
    title: "🚨 Market Update: Bitcoin Bull Flag Forming!",
    content:
      "We just saw a massive defense of the 4-hour support block. If this hourly candle closes above the current resistance level, expect an aggressive 5-8% push. Secure your stop losses and don't over-leverage here guys!",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    likesCount: 42,
    comments: [
      {
        id: "c1",
        authorName: "Maya",
        authorAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        content:
          "This is the kind of level breakdown I was waiting for. Great call.",
        timeAgo: "4m ago",
      },
      {
        id: "c2",
        authorName: "Eddie",
        authorAvatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        content:
          "Watching the 4H support. If it holds, I’m buying the next retest.",
        timeAgo: "2m ago",
      },
    ],
  },
  {
    id: "2",
    authorName: "Tunde (Crypto Alpha)",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    timeAgo: "3 hours ago",
    title: "💎 Gem Pick of the Week",
    content:
      "I am quietly accumulating this micro-cap utility token before the ecosystem integration goes live on Friday. Risk profile is high, so position size conservatively. I will post exact buy zones in the private chat shortly.",
    likesCount: 89,
    comments: [
      {
        id: "c3",
        authorName: "Aisha",
        authorAvatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        content: "Been waiting on this one. Appreciate the transparency.",
        timeAgo: "1h ago",
      },
      {
        id: "c4",
        authorName: "Jon",
        authorAvatar:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80",
        content: "This is exactly why I joined the private circle.",
        timeAgo: "35m ago",
      },
    ],
  },
];
