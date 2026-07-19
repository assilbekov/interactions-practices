"use client";

import { useState } from "react";
import { HeartIcon, MessageCircleIcon, Repeat2Icon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const LIMIT = 280;

type Post = {
  id: number;
  author: string;
  handle: string;
  initials: string;
  text: string;
  likes: number;
  liked: boolean;
  replies: number;
  time: string;
};

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Dana Serik",
    handle: "@dana_builds",
    initials: "DS",
    text: "Hot take: your loading spinner is why your app feels slow. Skeletons for 2s+, blur for fast updates. The pattern matters more than the milliseconds.",
    likes: 128,
    liked: false,
    replies: 14,
    time: "2h",
  },
  {
    id: 2,
    author: "Timur Aliyev",
    handle: "@timur_dev",
    initials: "TA",
    text: "Shipped a theme mixer where lightness and chroma are locked per role and only the hue moves. OKLCH makes 'any color, same weight' actually work.",
    likes: 87,
    liked: true,
    replies: 9,
    time: "5h",
  },
  {
    id: 3,
    author: "Mia Chen",
    handle: "@miamakes",
    initials: "MC",
    text: "Buttons should be 40–48px. Your users' thumbs will thank you.",
    likes: 342,
    liked: false,
    replies: 28,
    time: "1d",
  },
];

export function SocialModule() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [draft, setDraft] = useState("");
  const [nextId, setNextId] = useState(4);

  const remaining = LIMIT - draft.length;
  const canPost = draft.trim().length > 0 && remaining >= 0;

  const publish = () => {
    if (!canPost) return;
    setPosts((prev) => [
      {
        id: nextId,
        author: "You",
        handle: "@you",
        initials: "YO",
        text: draft.trim(),
        likes: 0,
        liked: false,
        replies: 0,
        time: "now",
      },
      ...prev,
    ]);
    setDraft("");
    setNextId((id) => id + 1);
  };

  const toggleLike = (id: number) =>
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post,
      ),
    );

  return (
    <Card className="mx-auto max-w-xl">
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
              YO
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="What's happening?"
              rows={3}
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Compose post"
            />
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "font-mono text-xs tabular-nums",
                  remaining < 0
                    ? "font-medium text-destructive"
                    : remaining <= 20
                      ? "text-destructive/70"
                      : "text-muted-foreground",
                )}
              >
                {remaining}
              </span>
              <Button disabled={!canPost} onClick={publish}>
                Post
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="flex gap-3">
              <Avatar>
                <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                  {post.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-sm">
                  <span className="font-semibold">{post.author}</span>{" "}
                  <span className="text-muted-foreground">
                    {post.handle} · {post.time}
                  </span>
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {post.text}
                </p>
                <div className="flex items-center gap-5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    aria-pressed={post.liked}
                    aria-label={post.liked ? "Unlike" : "Like"}
                    className={cn(
                      "flex items-center gap-1.5 text-xs transition-colors",
                      post.liked
                        ? "font-medium text-destructive"
                        : "text-muted-foreground hover:text-destructive",
                    )}
                  >
                    <HeartIcon
                      className={cn("size-4", post.liked && "fill-current")}
                    />
                    <span className="font-mono tabular-nums">{post.likes}</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageCircleIcon className="size-4" />
                    <span className="font-mono tabular-nums">
                      {post.replies}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Repeat2Icon className="size-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
