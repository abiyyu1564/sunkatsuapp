import USER_ICON from "../../../../assets/user_icon.png";

export default function Sidebar({ shown, users, peer, unread, onSelect, setShown }) {
  const handleSelect = (user) => {
    onSelect(user);
    // Close sidebar if on small screens (below 640px)
    if (window.innerWidth < 640 && typeof setShown === "function") {
      setShown(false);
    }
  };

  return (
    <aside
      className={`fixed sm:static top-0 left-0 h-full w-64 bg-white border-r
                  transition-transform duration-200 z-20
                  ${shown ? "translate-x-0"
                          : "-translate-x-full sm:translate-x-0"}`}
    >
      <h2 className="p-4 border-b text-sm font-bold tracking-wide text-red-600">
        ONLINE USERS
      </h2>
      <ul className="overflow-y-auto h-[calc(100%-48px)]">
        {users.map(u => (
          <li
            key={u.id}
            onClick={() => handleSelect(u)}
            className={`flex items-center gap-3 px-4 py-2 cursor-pointer
                        ${peer?.id === u.id ? "bg-red-50" : "hover:bg-gray-100"}`}
          >
            <img src={USER_ICON} alt="" className="w-8 h-8 rounded-full" />
            <span className="flex-1 truncate text-sm">{u.username}</span>
            {!!unread[u.id] && (
              <span className="text-xs bg-red-600 text-white px-2 rounded-full">
                {unread[u.id]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
