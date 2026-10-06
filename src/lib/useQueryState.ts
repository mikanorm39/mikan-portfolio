"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * URL のクエリ（?category=web など）を読み書きする小さなフック。
 * 不正な値や未指定は fallback（"all"）として扱い、"all" のときはクエリから消す。
 * history.replaceState を使うので、サーバーへの再リクエストは発生しない。
 */
export function useQueryState<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const raw = searchParams.get(key);
  const value = raw && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;

  const setValue = useCallback(
    (next: T) => {
      const params = new URLSearchParams(window.location.search);
      if (next === fallback) params.delete(key);
      else params.set(key, next);
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    },
    [key, fallback, pathname],
  );

  return [value, setValue] as const;
}
