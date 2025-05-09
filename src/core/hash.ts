/*
 * hash.ts
 *
 * Copyright (C) 2020-2022 Posit Software, PBC
 */

import { crypto } from "crypto/crypto";
import blueimpMd5 from "blueimpMd5";

export function md5HashSync(content: string) {
  return blueimpMd5(content);
}

export async function md5HashAsync(content: string) {
  const buffer = new TextEncoder().encode(content);
  return md5HashBytes(buffer);
}

export async function md5HashBytes(content: Uint8Array) {
  const buffer = await crypto.subtle.digest(
    "MD5",
    content,
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Simple insecure hash for a string
export function insecureHash(content: string) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return new Uint32Array([hash])[0].toString(36);
}
