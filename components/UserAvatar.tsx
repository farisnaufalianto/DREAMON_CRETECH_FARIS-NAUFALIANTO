"use client";

import { useState } from "react";
import type { SafeUser } from "@/lib/types";

export default function UserAvatar({ user, size = 32 }: { user: SafeUser; size?: number }) {
  const [failed, setFailed] = useState(false);
  const initials = `${user.firstName[0] ?? user.username[0] ?? "?"}${user.lastName[0] ?? ""}`.toUpperCase();

  if (!user.image || failed) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="grid shrink-0 place-items-center rounded-full bg-coral text-xs font-medium text-ink"
      >
        {initials}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.image}
      alt={`${user.firstName} ${user.lastName}`.trim() || user.username}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full bg-navy object-cover"
      style={{ width: size, height: size }}
    />
  );
}
