import { useState, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import Sidebar        from "./components/Sidebar";
import MessageList    from "./components/MessageList";
import Composer       from "./components/Composer";
import { useAuth, useChat } from "./hooks";

export default function ChatPage() {
  const { token, me }                = useAuth();
  const {
    users, peer, setPeer,
    chat,   sendMessage,
    deleteMsg, updateMsg,
    unread,  clearUnread,
  }                                   = useChat(token, me);
  const [showSidebar, setShowSidebar] = useState(false);
  const listRef                       = useRef(null);

  return (
    <div className="h-screen flex flex-col sm:flex-row bg-gray-50">
      <Sidebar
        shown={showSidebar}
        users={users}
        peer={peer}
        unread={unread}
        onSelect={u => { setPeer(u); clearUnread(u.id); setShowSidebar(false); }}
      />

      <section className="flex-1 flex flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-10 flex items-center gap-3
                           bg-white border-b border-red-200 px-4 py-3">
          <button
            onClick={() => setShowSidebar(s => !s)}
            className="sm:hidden text-red-600 text-2xl p-1 -ml-1"
          >
            <HiMenu />
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center w-8 h-8
                       rounded-full hover:bg-black/10 text-red-600 text-xl"
          >
            ←
          </a>
          <span className="font-semibold">
            {peer ? `Chat with ${peer.username}` : "Select a user"}
          </span>
        </header>

        {/* messages */}
        <MessageList
          ref={listRef}
          meId={me.id}
          messages={chat}
          peer={peer}
          onDelete={deleteMsg}
          onEdit={updateMsg}
        />

        {/* composer */}
        {peer && (
          <Composer onSend={(text, file) => sendMessage(text, file, peer.id)} />
        )}
      </section>
    </div>
  );
}
