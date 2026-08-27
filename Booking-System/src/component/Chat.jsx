// Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/useAuth";

export const Chat = ({ socket, isVisible, setIsVisible }) => {
    const { currentUser } = useAuth();
    const [message, setMessage] = useState("");
    const [conversations, setConversations] = useState({});
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [lastActivity, setLastActivity] = useState({});

    const bottomRef = useRef(null);
    const isAdmin = currentUser?.role === "Admin";
    const needsUserSelection = isAdmin && !selectedUser;

    const selectedUserRef = useRef(selectedUser);
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    useEffect(() => {
        if (!currentUser) return;

        const token = localStorage.getItem('token');

        console.log("🟢 Chat: Sending register with token:", token ? "YES" : "NO");

        socket.emit("register", {
            username: currentUser.username,
            role: currentUser.role,
            token: token 
        });

        if (currentUser.role === "Admin") {
            socket.off("user-list");
            socket.on("user-list", (list) => {
                setUserList(list);
            });
        }

        socket.off("receive-message");
        socket.on("receive-message", ({ from, message, sender }) => {
            const conversationKey = currentUser.role === "Admin" ? from : "Admin";
            const timestamp = new Date().toISOString();

            setIsVisible(true);

            if (currentUser.role === "Admin" && sender === "user") {
                if (!selectedUserRef.current) {
                    setSelectedUser(from);
                }

                setLastActivity((prev) => ({ ...prev, [from]: Date.now() }));

                if (selectedUserRef.current !== from) {
                    setUnreadCounts((prev) => ({
                        ...prev,
                        [from]: (prev[from] || 0) + 1,
                    }));
                }
            }

            setConversations((prev) => {
                const existing = prev[conversationKey] || { messages: [] };
                return {
                    ...prev,
                    [conversationKey]: {
                        messages: [
                            ...existing.messages,
                            { message, sender, senderName: from, timestamp }
                        ],
                    },
                };
            });
        });

        return () => {
            socket.off("user-list");
            socket.off("receive-message");
        };
    }, [currentUser, socket, setIsVisible]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [conversations, selectedUser]);

    if (!currentUser) return null;
    if (!isVisible) return null;

    const activeKey = isAdmin ? selectedUser : "Admin";
    const activeMessages = conversations[activeKey]?.messages || [];

    const sortedUserList = [...userList].sort((a, b) => {
        const timeA = lastActivity[a] || 0;
        const timeB = lastActivity[b] || 0;
        return timeB - timeA;
    });

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setUnreadCounts((prev) => ({ ...prev, [user]: 0 }));
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const timestamp = new Date().toISOString();

        if (isAdmin) {
            if (!selectedUser) return;

            socket.emit("admin-message", {
                to: selectedUser,
                message,
            });

            setConversations((prev) => {
                const existing = prev[selectedUser] || { messages: [] };
                return {
                    ...prev,
                    [selectedUser]: {
                        messages: [
                            ...existing.messages,
                            { message, sender: "Admin", senderName: "Admin", timestamp }
                        ],
                    },
                };
            });
        } else {
            socket.emit("user-message", {
                from: currentUser.username,
                message,
            });

            setConversations((prev) => {
                const existing = prev["Admin"] || { messages: [] };
                return {
                    ...prev,
                    Admin: {
                        messages: [
                            ...existing.messages,
                            { message, sender: "user", senderName: currentUser.username, timestamp }
                        ],
                    },
                };
            });
        }

        setMessage("");
    };

    return (
        <div className={`fixed bottom-20 right-4 h-96 bg-[#23262f] border border-[#3a3d48] rounded-xl shadow-2xl flex z-[200] overflow-hidden text-white transition-all duration-300 ${isAdmin ? "w-96" : "w-72"}`}>
            {isAdmin && (
                <div className="w-28 bg-[#1a1c24] border-r border-[#3a3d48] hide-scrollbar overflow-y-auto flex-shrink-0">
                    <p className="text-[10px] text-[#b6ff2e] p-1.5 font-bold text-center border-b border-[#3a3d48]">ONLINE</p>
                    {sortedUserList.length === 0 ? (
                        <p className="text-zinc-500 text-[11px] text-center p-2">No users</p>
                    ) : (
                        sortedUserList.map((user) => (
                            <button
                                key={user}
                                onClick={() => handleSelectUser(user)}
                                className={`relative w-full px-2 py-2.5 text-[11px] truncate transition-colors text-center ${
                                    selectedUser === user
                                        ? "bg-[#b6ff2e] text-[#23262f] font-bold"
                                        : "text-[#b6ff2e] hover:bg-[#2d303a]"
                                }`}
                            >
                                👤 {user}
                                {unreadCounts[user] > 0 && (
                                    <span className="absolute top-3 left-3 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}

            <div className="flex-1 flex flex-col bg-[#23262f]">
                <div className="bg-[#2d303a] text-[#b6ff2e] text-sm font-bold px-3 py-2 border-b border-[#3a3d48] flex justify-between items-center">
                    <span>
                        {isAdmin
                            ? selectedUser
                                ? `Chat with ${selectedUser}`
                                : "Select a user"
                            : "Chat with Admin"}
                    </span>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-zinc-400 hover:text-white text-xs"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-3 flex flex-col hide-scrollbar">
                    {needsUserSelection ? (
                        <p className="text-zinc-500 text-xs text-center my-auto">Choose users to reply</p>
                    ) : (
                        activeMessages.map((msg, index) => {
                            const isMyMessage = (isAdmin && msg.sender === "Admin") || (!isAdmin && msg.sender === "user");

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col max-w-[75%] ${
                                        isMyMessage 
                                            ? "align-self-end ml-auto items-end" 
                                            : "align-self-start mr-auto items-start"
                                    }`}
                                >
                                    {!isMyMessage && (
                                        <span className="text-[10px] text-zinc-400 mb-0.5 ml-1 font-semibold">
                                            {msg.senderName || (isAdmin ? "User" : "Admin")}
                                        </span>
                                    )}

                                    <div
                                        className={`px-3 py-2 rounded-lg text-xs break-words ${
                                            isMyMessage
                                                ? "bg-[#b6ff2e] text-[#23262f] rounded-tr-none"
                                                : "bg-[#2d303a] text-white rounded-tl-none"
                                        }`}
                                    >
                                        {msg.message}
                                    </div>
                                    <span className="text-[9px] text-zinc-500 mt-0.5 px-1">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="flex gap-2 p-2 border-t border-[#3a3d48] bg-[#23262f]">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type message..."
                        disabled={needsUserSelection}
                        className="flex-1 min-w-0 bg-[#2d303a] border border-[#3a3d48] rounded-lg px-2 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#b6ff2e]"
                    />
                    <button
                        type="submit"
                        disabled={needsUserSelection}
                        className="px-3 py-1.5 bg-[#b6ff2e] hover:bg-[#a3e829] text-[#23262f] text-xs font-bold rounded-lg disabled:opacity-50 transition-colors shrink-0"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
};