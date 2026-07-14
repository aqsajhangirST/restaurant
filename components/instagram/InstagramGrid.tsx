"use client";

import Image from "next/image";
import { Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InstagramPostData } from "@/types";

const PROFILE_URL = "https://www.instagram.com/bayroute_f6/";

interface InstagramGridProps {
  posts: InstagramPostData[];
}

export function InstagramGrid({ posts }: InstagramGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {posts.map((post) => (
        <a
          key={post.id}
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={post.caption}
          className={cn(
            "group relative aspect-square overflow-hidden rounded-lg",
            "border border-gold-500/20",
            "bg-charcoal-900"
          )}
        >
          {post.kind === "photo" ? (
            <Image
              src={typeof post.src === "string" ? post.src : ""}
              alt={post.caption}
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <video
              src={typeof post.src === "string" ? post.src : ""}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}

          <div className="absolute inset-0 bg-black/10 transition-all duration-300 group-hover:bg-black/30" />

          <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white">
            {post.kind === "reel" ? (
              <Play size={14} fill="white" />
            ) : (
              <Camera size={14} />
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-2 transition-transform duration-300 group-hover:translate-y-0">
            <p className="text-xs text-white">{post.caption}</p>
          </div>
        </a>
      ))}
    </div>
  );
}