import { useState } from "react";

export default function Composer({ onSend }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const submit = e => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    onSend(text.trim(), file);
    setText(""); setFile(null);
  };

  return (
    <form onSubmit={submit}
          className="border-t flex gap-2 px-4 py-3 bg-white">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type…"
        className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-red-400"
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="text-sm"
      />
      <button
        disabled={!text.trim() && !file}
        className="bg-red-600 hover:bg-red-700 text-white
                   rounded-lg px-4 text-sm disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
