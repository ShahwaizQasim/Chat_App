import React, { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import io from 'socket.io-client'
import { PrivateVariables } from '../../config/config';
import { useEffect } from 'react';
import axios from 'axios'
import { AppRoutes } from '../../constant/AppRoutes';
import { useSelector } from 'react-redux';

const socket = io(PrivateVariables.BACKEND_URL);

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userGet = useSelector((state) => state?.user)
  const myUserId = userGet.user._id;

  const GetUsers = async () => {
    try {
      const users = await axios.get(AppRoutes.UsersGet);
      console.log("++++++++++", users.data.users);

      setUsers(users.data.users);

    } catch (error) {
      console.log("error++++", error);
    }
  }

  // console.log('users+++++++++++', users);


  useEffect(() => {
    GetUsers();
  }, [])

  // Sample chat messages
  const chatMessages = {
    1: [
      { id: 1, text: 'Salam Ahmed! Kya haal hai?', sender: 'me', time: '2:25 PM' },
      { id: 2, text: 'Walaikum salam! Sab theek, aap sunayein', sender: 'user', time: '2:26 PM' },
      { id: 3, text: 'Alhamdulillah, office ka kaam busy hai', sender: 'me', time: '2:28 PM' },
      { id: 4, text: 'Haan same yahan bhi, weekend plans kya hain?', sender: 'user', time: '2:30 PM' }
    ],
    2: [
      { id: 1, text: 'Meeting ka time 3 PM theek rahega?', sender: 'me', time: '1:40 PM' },
      { id: 2, text: 'Haan bilkul, main ready rahungi', sender: 'user', time: '1:45 PM' }
    ],
    3: [
      { id: 1, text: 'Hassan project ka status kya hai?', sender: 'me', time: '12:10 PM' },
      { id: 2, text: 'Project complete ho gaya, review kar lein', sender: 'user', time: '12:15 PM' }
    ]
  };

  const filteredUsers = users
    .filter(user =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a._id === myUserId) return -1;  // ✅ me top
      if (b._id === myUserId) return 1;
      return 0;
    });

  // console.log('filteredUsers', filtered);


  useEffect(() => {
    if (!selectedUser) return;

    const roomId = `room-${selectedUser._id}`; // tum apni marzi se naam rakh sakte ho

    // Join room
    socket.emit("join-room", roomId);
    console.log("Joining room:", roomId);

    // Optional: agar user change ho to purane room se nikalna chaho to:
    return () => {
      // Agar leave-room backend pe handle karna ho to:
      // socket.emit("leave-room", roomId);
    };
  }, [selectedUser]);


  useEffect(() => {
    socket.on("private_message", (msg) => {
      console.log("Receive msg:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("private_message");
  }, []);


  const HandleSendPrivateMessage = (receiverId) => {
    if (!message.trim()) return;

    // myUserId = 
    const newMessage = {
      text: message,
      senderId: myUserId,        // real sender
      receiverId: receiverId,   // samnay wala user
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
    };

    // Apni UI me pehle add karo
    setMessages((prev) => [...prev, newMessage]);

    // Backend ko bhejo
    socket.emit("private_message", {
      message: newMessage,
      receiverId,
    });

    setMessage("");
  };

  // console.log('message', message);
  console.log('messages', messages);


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      HandleSendPrivateMessage(selectedUser._id.toString());
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Users List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
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
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
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
                      {user.userName}
                      {user._id === myUserId && <span className="ml-1 text-blue-400">(You)</span>}
                    </h3>
                    <span className="text-xs text-gray-500">{user.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{user.lastMessage}</p>
                </div>
                {user.unreadCount > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {user.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
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
                  <h2 className="font-semibold text-gray-900">{selectedUser.userName}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedUser.online ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => {
                const isMe = msg.senderId === myUserId;

                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isMe
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                        }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={() => HandleSendPrivateMessage(selectedUser._id)}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={!message.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No User Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Chat</h2>
              <p className="text-gray-500">Select a user from the left to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;