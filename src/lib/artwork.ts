import { existsSync } from "node:fs";
import { join } from "node:path";

export function artworkNumbers(slug: string, limit = 100): number[] {
  const numbers: number[] = [];
  for (let n = 1; n <= limit; n += 1) {
    if (existsSync(join(process.cwd(), "public", "images", slug, `page-${n}.png`))) numbers.push(n);
  }
  return numbers;
}

export function artworkCount(slug: string): number {
  return artworkNumbers(slug).length;
}
