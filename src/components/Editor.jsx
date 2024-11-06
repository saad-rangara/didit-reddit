// components/Editor.jsx
"use client";
// import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { Link } from "@tiptap/extension-link";
import dynamic from "next/dynamic";

export const Editor = dynamic(
  () => import("@tiptap/react").then((mod) => mod.EditorContent),
  { ssr: false }
);

export function EditorComponent() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({
        resizable: true,
      }),
      Text,
    ],
    content: "<p>Hello World! 👋</p>",
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container">
      <EditorContent editor={editor} />
    </div>
  );
}
