/** Opt-in scroll pipeline diagnostics. Enable with REASONIX_SCROLL_DEBUG=1. */

export function scrollDebugEnabled(): boolean {
  const raw = process.env.REASONIX_SCROLL_DEBUG;
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export function scrollDebug(msg: string, data?: Record<string, unknown>): void {
  if (!scrollDebugEnabled()) return;
  const extra = data === undefined ? "" : ` ${JSON.stringify(data)}`;
  process.stderr.write(`[scroll-debug] ${msg}${extra}\n`);
}
