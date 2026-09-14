"use client";
import { useRef, useEffect } from "react";
export function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      ref.current &&
      ref.current.innerHTML !== value &&
      document.activeElement !== ref.current
    )
      ref.current.innerHTML = value;
  }, [value]);
  function command(name: string, value?: string) {
    ref.current?.focus();
    document.execCommand(name, false, value);
    if (ref.current) onChange(ref.current.innerHTML);
  }
  return (
    <>
      <div
        className="editor-toolbar"
        role="toolbar"
        aria-label="Article formatting"
      >
        {[
          ["Bold", "bold"],
          ["Italic", "italic"],
          ["Bullets", "insertUnorderedList"],
          ["Numbered list", "insertOrderedList"],
        ].map(([label, cmd]) => (
          <button
            key={cmd}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => command(cmd)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => command("formatBlock", "h2")}
        >
          Heading 2
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => command("formatBlock", "h3")}
        >
          Heading 3
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => command("formatBlock", "p")}
        >
          Paragraph
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const href = prompt("Link URL (local path or HTTPS)");
            if (href && (/^\/(?!\/)/.test(href) || /^https:\/\//.test(href)))
              command("createLink", href);
          }}
        >
          Link
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => command("unlink")}
        >
          Unlink
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => command("removeFormat")}
        >
          Clear formatting
        </button>
      </div>
      <div
        ref={ref}
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Article body"
        aria-multiline="true"
        onInput={() => onChange(ref.current?.innerHTML || "")}
        onPaste={(e) => {
          e.preventDefault();
          command("insertText", e.clipboardData.getData("text/plain"));
        }}
      />
    </>
  );
}
