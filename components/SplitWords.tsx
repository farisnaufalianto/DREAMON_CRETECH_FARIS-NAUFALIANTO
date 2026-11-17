import type { ElementType, ReactNode } from "react";

type Props = {
  text: string;
  /** data attribute put on every word (used as a GSAP selector), e.g. "data-hero-word" */
  wordAttr: string;
  className?: string;
  as?: ElementType;
  /** index from which words get the `accentClass` */
  accentFrom?: number;
  accentClass?: string;
};

/** Splits text into masked words for reveal animations. Screen readers get the plain text. */
export default function SplitWords({
  text,
  wordAttr,
  className,
  as = "span",
  accentFrom,
  accentClass = "text-coral-soft",
}: Props) {
  const Tag = as as ElementType<{ className?: string; children?: ReactNode }>;
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <span
                {...{ [wordAttr]: "" }}
                className={`inline-block will-change-transform ${accentFrom !== undefined && i >= accentFrom ? accentClass : ""
                  }`}
              >
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}