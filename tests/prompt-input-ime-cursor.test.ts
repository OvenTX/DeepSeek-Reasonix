/** Pure column math for parking the terminal cursor on PromptInput's ▌ (IME / a11y). */
import { describe, expect, it } from "vitest";
import { imeCursorColumn } from "../src/cli/ui/PromptInput.js";

describe("imeCursorColumn", () => {
  const prefix = "› ";
  const cont = "  ";

  it("places caret after the prompt prefix on an empty / placeholder line", () => {
    expect(
      imeCursorColumn({
        isFirst: true,
        promptPrefix: prefix,
        continuationIndent: cont,
        hiddenLeft: false,
        cursorCell: 0,
      }),
    ).toBe(prefix.length);
  });

  it("offsets by viewport cursor cells for mid-line caret", () => {
    expect(
      imeCursorColumn({
        isFirst: true,
        promptPrefix: prefix,
        continuationIndent: cont,
        hiddenLeft: false,
        cursorCell: 5,
      }),
    ).toBe(prefix.length + 5);
  });

  it("accounts for the hidden-left ‹ indicator", () => {
    expect(
      imeCursorColumn({
        isFirst: true,
        promptPrefix: prefix,
        continuationIndent: cont,
        hiddenLeft: true,
        cursorCell: 3,
      }),
    ).toBe(prefix.length + 1 + 3);
  });

  it("uses continuation indent on non-first visual rows", () => {
    expect(
      imeCursorColumn({
        isFirst: false,
        promptPrefix: prefix,
        continuationIndent: cont,
        hiddenLeft: false,
        cursorCell: 2,
      }),
    ).toBe(cont.length + 2);
  });
});
