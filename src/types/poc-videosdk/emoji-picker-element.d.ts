// src/types/emoji-picker-element.d.ts
import type * as React from "react";

declare global {
  interface EmojiClickDetail {
    emoji?: { unicode?: string };
    unicode?: string;
  }
  type EmojiClickEvent = CustomEvent<EmojiClickDetail>;
}

// React 19 JSX namespace augmentation
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "emoji-picker": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "data-theme"?: "light" | "dark" | "auto";
      };
    }
  }
}
