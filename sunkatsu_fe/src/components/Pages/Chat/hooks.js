import { useState, useEffect } from "react";
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
  const [chat,  setChat]  = useState([]);
  const [unread,setUnread]= useState({});

  /* connect socket once */
  useEffect(() => {
    if (!me.id) return;

    const sock = new SockJS(`${API}/ws`);
    const c    = Stomp.over(sock);
    c.debug    = () => {};

    c.connect({}, () => {
      c.subscribe(`/user/${me.id}/queue/messages`, p => {
        const m = JSON.parse(p.body);
        setChat(ch => (peer && m.senderId === peer.id ? [...ch, m] : ch));
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

  const loadChat = async pid => {
    const r = await fetch(`${API}/messages/${me.id}/${pid}`);
    if (r.ok) setChat(await r.json());
  };

  useEffect(() => {
    if (!peer) return;
    (async () => {
      const r = await fetch(`${API}/messages/${me.id}/${peer.id}`);
      if (r.ok) setChat(await r.json());
    })();
  }, [peer, me.id]);


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
    id: `temp-${Date.now()}`, // Temporary ID for UI
    senderId: me.id,
    recipientId,
    content: text || null,
    imageUrl,
    timestamp: new Date(),
  };

  // Optimistically add to local chat state
  if (peer && recipientId === peer.id) {
    setChat((prev) => [...prev, newMessage]);
  }

  // Send to server
  stomp.send("/app/chat", {}, JSON.stringify(newMessage));
};


  const deleteMsg = async id => {
    const r = await fetch(`${API}/messages/${id}`, { method: "DELETE", headers });
    if (r.ok) setChat(c => c.filter(m => m.id !== id));
  };

  const updateMsg = async (id, newContent) => {
    const r = await fetch(`${API}/messages/${id}`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "text/plain" },
      body: newContent,
    });
    if (r.ok) {
      const updated = await r.json();
      setChat(c => c.map(m => (m.id === id ? updated : m)));
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
