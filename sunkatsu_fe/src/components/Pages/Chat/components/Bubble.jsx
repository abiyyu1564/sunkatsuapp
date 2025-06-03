import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";

const API_BASE = "http://localhost:8080";

export default function Bubble({ me, senderId, id, content, imageUrl, onDelete, onEdit }) {
  const [url, setUrl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content ?? "");

  const token = document.cookie
    .split("; ")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  useEffect(() => {
    if (!imageUrl) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}${imageUrl}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const blob = await res.blob();
          setUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error("Image fetch error:", err);
      }
    })();
  }, [imageUrl, token]);

  const mine = senderId === me;

  const save = async () => {
    if (draft.trim() === content) {
      setEditing(false);
      return;
    }
    await onEdit(id, draft.trim());
    setEditing(false);
  };

  return (
    <div
      className={`relative flex flex-col ${
        mine ? "items-end" : "items-start"
      } px-2 sm:px-4 py-1 group`}
    >
      {/* Message bubble */}
      <div
        className={`relative px-4 py-2 rounded-lg text-sm shadow w-fit max-w-[80%]
                    break-words
                    ${mine ? "bg-red-600 text-white" : "bg-gray-200"}`}
      >
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              className="w-full rounded border p-1 text-black"
            />
            <div className="flex gap-2 text-xs mt-1">
              <button onClick={save} className="px-2 py-0.5 bg-red-600 text-white rounded">
                Save
              </button>
              <button
                onClick={() => {
                  setDraft(content || "");
                  setEditing(false);
                }}
                className="px-2 py-0.5 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {content && <p>{content}</p>}
            {url && (
              <img
                src={url}
                alt="uploaded"
                className="mt-2 rounded-md max-h-60 max-w-full"
              />
            )}
          </>
        )}
      </div>

      {/* Hover-only icons */}
      {mine && !editing && (
        <div
          className="mt-1 flex gap-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <button onClick={() => setEditing(true)} title="Edit">
            <FiEdit2 className="hover:text-black" />
          </button>
          <button onClick={() => onDelete(id)} title="Delete">
            <FiTrash className="hover:text-black" />
          </button>
        </div>
      )}
    </div>
  );
}
