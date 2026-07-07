import React, { useState, useRef, useEffect } from "react";
import { Send, Search, MoreVertical, Phone, Video, LogOut } from "lucide-react";
import io from "socket.io-client";
import { PrivateVariables } from "../../config/config";
import axios from "axios";
import { AppRoutes } from "../../constant/AppRoutes";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/userSlice";
import ChatInputBar from "../../components/ChatInputBar";

const socket = io(PrivateVariables.BACKEND_URL);

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const messagesContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userGet = useSelector((state) => state?.user);
  const myUserId = userGet.user?._id;
  const token = Cookies.get("token");

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(logout());
    navigate("/login");
  };

  const GetUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await axios.get(AppRoutes.UsersGet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedUsers = Array.isArray(response?.data?.users)
        ? response.data.users
        : [];
      setUsers(fetchedUsers);
    } catch (error) {
      console.log("error++++", error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const GetAllMessages = async (receiverId) => {
    if (!myUserId || !receiverId) return;
    try {
      const getMessage = await axios.get(
        `${AppRoutes.GetMessages}${myUserId}/${receiverId}`,
      );
      setMessages(getMessage.data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const markMessagesAsRead = async (senderId) => {
    try {
      await axios.put(
        `${AppRoutes.markasRead}/api/messages/read/${senderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Sidebar state update
      setUsers((prev) =>
        prev.map((user) =>
          user._id === senderId ? { ...user, unreadCount: 0 } : user,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users
        .filter((user) =>
          user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => {
          if (a._id === myUserId) return -1;
          if (b._id === myUserId) return 1;
          return 0;
        })
    : [];

  const filteredMessages = selectedUser
    ? messages.filter(
        (msg) =>
          // console.log(msg.senderId === myUserId && msg.recieverId === selectedUser._id) ||

          (msg.senderId === myUserId && msg.recieverId === selectedUser._id) ||
          (msg.senderId === selectedUser._id && msg.recieverId === myUserId),
      )
    : [];

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [filteredMessages]);

  useEffect(() => {
    GetUsers();
  }, []);
  useEffect(() => {
    if (!myUserId) return;
    socket.emit("join-room", myUserId); // apna personal room
  }, [myUserId]);

  useEffect(() => {
    socket.on("private_message", (msg) => {
      console.log("Receive msg:", msg);
      setMessages((prev) => [...prev, msg]);
      GetUsers();
    });

    return () => socket.off("private_message");
  }, []);

  // Load messages when selectedUser changes
  useEffect(() => {
    const loadChat = async () => {
      if (!selectedUser || !myUserId) return;

      await GetAllMessages(selectedUser._id);
      await markMessagesAsRead(selectedUser._id);
    };

    loadChat();
  }, [selectedUser, myUserId]);

  const HandleSendPrivateMessage = (receiverId) => {
    if (!message.trim()) return;

    // myUserId =
    const newMessage = {
      text: message,
      messageType: "text",
      senderId: myUserId, // real sender
      recieverId: receiverId, // samnay wala user
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    // Apni UI me pehle add karo
    setMessages((prev) => [...prev, newMessage]);
    // Backend ko bhejo
    socket.emit("private_message", {
      message: newMessage,
      receiverId,
    });
    GetUsers();
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      HandleSendPrivateMessage(selectedUser._id.toString());
    }
  };

  const handleSendVoiceMessage = async (blobUrl) => {
    if (!selectedUser?._id || !myUserId) return;

    try {
      const res = await fetch(blobUrl);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("voice", blob);
      const response = await axios.post(`${AppRoutes.uploadVoice}`, formData);
      const voiceUrl = response.data.voiceUrl;
      console.log("voiceUrl => ", voiceUrl);

      const newMessage = {
        senderId: myUserId,
        recieverId: selectedUser._id,
        voice: voiceUrl,
        messageType: "voice",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, newMessage]);

      socket.emit("private_message", {
        receiverId: selectedUser._id,
        message: newMessage,
      });
      GetUsers();
    } catch (error) {
      console.error("Error fetching voice message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Users List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 pl-8 pt border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              Loading users...
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  GetAllMessages(user._id);
                }}
                className={`p-4 pl-8 pt-5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedUser?._id === user._id
                    ? "bg-blue-50 border-r-2 border-r-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.profilePicture}
                      alt={user.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 truncate">
                        <span>{user.userName}</span>
                        {user._id === myUserId && (
                          <span className="ml-1 text-blue-400">(You)</span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500">{user.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {user.lastMessage}
                    </p>
                  </div>
                  {user._id !== myUserId && user.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user?.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No users found
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedUser.profilePicture}
                    alt={selectedUser.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedUser.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedUser.userName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedUser.online ? "Online" : "Last seen recently"}
                  </p>
                </div>
              </div>
              <div className="relative flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {filteredMessages.map((msg, i) => {
                const isMe = msg.senderId === myUserId;

                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isMe
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {msg.messageType === "voice" || msg.type === "voice" ? (
                        <div className="flex flex-col gap-2 md:w-80 w-full">
                          <audio
                            src={msg.voice}
                            controls
                            className="w-full rounded-md bg-black/5"
                          />
                        </div>
                      ) : (
                        <p className="text-sm">{msg.text}</p>
                      )}
                      <p
                        className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <ChatInputBar
              message={message}
              setMessage={setMessage}
              handleKeyPress={handleKeyPress}
              selectedUser={selectedUser}
              HandleSendPrivateMessage={HandleSendPrivateMessage}
              handleSendVoiceMessage={handleSendVoiceMessage}
            />
          </>
        ) : (
          /* No User Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to Chat
              </h2>
              <p className="text-gray-500">
                Select a user from the left to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
