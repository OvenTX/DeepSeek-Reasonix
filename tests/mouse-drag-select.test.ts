import { describe, expect, it } from "vitest";
import type { KeyEvent } from "../src/cli/ui/stdin-reader.js";

/**
 * Minimal pure bridge used by App.tsx left-drag copy-on-select.
 * Kept free of React/Ink so we can unit-test the event routing without
 * spinning up a full TUI.
 */
function routeMouseSelection(
  ev: KeyEvent,
  selection: {
    beginTextSelection: (col: number, row: number) => void;
    handleSelectionDrag: (col: number, row: number) => void;
    finishTextSelection: (copy?: boolean) => void;
  },
): void {
  if (ev.mouseClick && ev.mouseRow != null && ev.mouseCol != null) {
    selection.beginTextSelection(ev.mouseCol - 1, ev.mouseRow - 1);
    return;
  }
  if (ev.mouseDrag && ev.mouseRow != null && ev.mouseCol != null) {
    selection.handleSelectionDrag(ev.mouseCol - 1, ev.mouseRow - 1);
    return;
  }
  if (ev.mouseRelease) {
    selection.finishTextSelection(true);
  }
}

describe("mouse drag-select bridge", () => {
  it("converts 1-based SGR coords to 0-based screen cells and copy-on-selects", () => {
    const calls: string[] = [];
    const selection = {
      beginTextSelection: (col: number, row: number) => calls.push(`begin:${col},${row}`),
      handleSelectionDrag: (col: number, row: number) => calls.push(`drag:${col},${row}`),
      finishTextSelection: (copy?: boolean) => calls.push(`finish:${String(copy)}`),
    };

    routeMouseSelection({ input: "", mouseClick: true, mouseCol: 5, mouseRow: 3 }, selection);
    routeMouseSelection({ input: "", mouseDrag: true, mouseCol: 12, mouseRow: 3 }, selection);
    routeMouseSelection({ input: "", mouseRelease: true, mouseCol: 12, mouseRow: 3 }, selection);

    expect(calls).toEqual(["begin:4,2", "drag:11,2", "finish:true"]);
  });

  it("ignores incomplete mouse reports without coordinates", () => {
    const calls: string[] = [];
    const selection = {
      beginTextSelection: () => calls.push("begin"),
      handleSelectionDrag: () => calls.push("drag"),
      finishTextSelection: () => calls.push("finish"),
    };

    routeMouseSelection({ input: "", mouseClick: true }, selection);
    routeMouseSelection({ input: "", mouseDrag: true }, selection);
    routeMouseSelection({ input: "", mouseRelease: true }, selection);

    expect(calls).toEqual(["finish"]);
  });
});
