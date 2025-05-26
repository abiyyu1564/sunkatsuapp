import { forwardRef } from "react";
import Bubble from "./Bubble";

const MessageList = forwardRef(
  ({ meId, messages, peer, onDelete, onEdit }, ref) => (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
    >
      {messages.map(m => (
        <Bubble
          key={m.id}
          me={meId}
          {...m}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
      <div id="bottom-sentinel" />
    </div>
  )
);

export default MessageList;
