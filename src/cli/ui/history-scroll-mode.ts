import type { HistoryScrollMode } from "../../config.js";

export type ResolvedHistoryScrollMode = "native" | "app";

export interface ResolveHistoryScrollModeInput {
  configured?: HistoryScrollMode;
  env?: NodeJS.ProcessEnv | Record<string, string | undefined>;
  platform?: NodeJS.Platform;
}

export function resolveHistoryScrollMode({
  configured = "auto",
  env = process.env,
  platform = process.platform,
}: ResolveHistoryScrollModeInput = {}): ResolvedHistoryScrollMode {
  if (configured === "native") return "native";
  if (configured === "app") return "app";
  if (isKnownJumpProneTerminal(env)) return "app";
  if (platform === "win32" && env.TERM_PROGRAM === undefined && env.MSYSTEM === undefined) {
    return "native";
  }
  return "native";
}

function isKnownJumpProneTerminal(env: NodeJS.ProcessEnv | Record<string, string | undefined>) {
  const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
  if (termProgram === "vscode") return true;
  if (typeof env.WT_SESSION === "string" && env.WT_SESSION.length > 0) return true;
  if (typeof env.MSYSTEM === "string" && env.MSYSTEM.length > 0) return true;
  // Ghostty was bundled here in #1766, but app mode costs users their native
  // wheel scrollback, so auto keeps it native. `historyScrollMode: "app"`
  // remains the opt-in if native redraws ever jump.
  return false;
}
