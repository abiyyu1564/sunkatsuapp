import { useState, useEffect, useCallback } from "react";
import SockJS from "sockjs-client";
import Stomp  from "stompjs";

const API = "http://localhost:8080";

export function useAuth() {
  const getCookie = k =>
    document.cookie.split("; ").find(c => c.startsWith(k + "="))?.split("=")[1];
  const parseJwt  = t => (t ? JSON.parse(atob(t.split(".")[1])) : null);

  const token = getCookie("token");
  const me    = parseJwt(token) ?? {};

  return { token, me };
}

export function useChat(token, me) {
  /* state */
  const [stomp, setStomp] = useState(null);
  const [users, setUsers] = useState([]);
  const [peer,  setPeer]  = useState(null);
  const [chats, setChats] = useState({}); // { [peerId]: [messages] }
  const [chat,  setChat]  = useState([]); // current chat for selected peer
  const [unread,setUnread]= useState({});

  /* connect socket once */
  useEffect(() => {
    if (!me.id) return;

    const sock = new SockJS(`${API}/ws`);
    const c    = Stomp.over(sock);
    c.debug    = () => {};

    c.connect({}, () => {
      // Subscribe to the correct user destination (Spring routes to the current user session)
      c.subscribe(`/user/queue/messages`, p => {
        console.log('WebSocket message received:', p.body);
        const m = JSON.parse(p.body);
        setChats(prev => {
          const peerId = m.senderId === me.id ? m.recipientId : m.senderId;
          const updated = { ...prev, [peerId]: [...(prev[peerId] || []), m] };
          // If this is the current peer, update chat state
          if (peer && peer.id === peerId) setChat(updated[peerId]);
          return updated;
        });
        if (!peer || m.senderId !== peer.id)
          setUnread(u => ({ ...u, [m.senderId]: (u[m.senderId] || 0) + 1 }));
      });
      refreshUsers();
      setStomp(c);
    });

    return () => (c.connected ? c.disconnect() : sock.close());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.id, peer?.id]);

  /* REST helpers */
  const headers = { Authorization: `Bearer ${token}` };

  const refreshUsers = async () => {
    const r = await fetch(`${API}/api/users/status/${me.id}`);
    if (r.ok) setUsers(await r.json());
  };

  const loadChat = useCallback(async pid => {
    const r = await fetch(`${API}/messages/${me.id}/${pid}`);
    if (r.ok) {
      const msgs = await r.json();
      setChats(prev => ({ ...prev, [pid]: msgs }));
      if (peer && peer.id === pid) setChat(msgs);
    }
  }, [me.id, peer]);

  // When peer changes, load chat from map or fetch from server
  useEffect(() => {
    if (!peer) return setChat([]);
    if (chats[peer.id]) {
      setChat(chats[peer.id]);
    } else {
      loadChat(peer.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peer, chats, loadChat]);

  // Polling fallback: fetch latest messages for selected peer every 5 seconds
  useEffect(() => {
    if (!peer) return;
    const interval = setInterval(() => {
      loadChat(peer.id);
    }, 5000);
    return () => clearInterval(interval);
  }, [peer, loadChat]);

  /* send, edit, delete */
  const sendMessage = async (text, file, recipientId) => {
    if (!stomp?.connected) return;

    let imageUrl = null;
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch(`${API}/api/files/upload`, {
        method: "POST",
        headers,
        body: fd,
      });
      if (up.ok) imageUrl = await up.text();
    }

    const newMessage = {
      id: `temp-${Date.now()}`,
      senderId: me.id,
      recipientId,
      content: text || null,
      imageUrl,
      timestamp: new Date(),
    };

    // Optimistically add to local chat state
    setChats(prev => {
      const updated = { ...prev, [recipientId]: [...(prev[recipientId] || []), newMessage] };
      if (peer && peer.id === recipientId) setChat(updated[recipientId]);
      return updated;
    });

    stomp.send("/app/chat", {}, JSON.stringify(newMessage));
  };

  const deleteMsg = async id => {
    const r = await fetch(`${API}/messages/${id}`, { method: "DELETE", headers });
    if (r.ok) {
      setChats(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(pid => {
          updated[pid] = updated[pid].filter(m => m.id !== id);
        });
        if (peer && updated[peer.id]) setChat(updated[peer.id]);
        return updated;
      });
    }
  };

  const updateMsg = async (id, newContent) => {
    const r = await fetch(`${API}/messages/${id}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "text/plain" },
      body: newContent,
    });
    if (r.ok) {
      const updatedMsg = await r.json();
      setChats(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(pid => {
          updated[pid] = updated[pid].map(m => (m.id === id ? updatedMsg : m));
        });
        if (peer && updated[peer.id]) setChat(updated[peer.id]);
        return updated;
      });
    }
  };

  const clearUnread = id => setUnread(u => ({ ...u, [id]: 0 }));

  return {
    users, peer, setPeer,
    chat,  sendMessage,
    deleteMsg, updateMsg,
    unread, clearUnread,
  };
}
