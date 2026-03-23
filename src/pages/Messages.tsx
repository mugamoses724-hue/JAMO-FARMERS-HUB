import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, User, Search, MessageSquare, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Messages: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const chats = [
    { id: '1', name: 'JAMO Support', lastMsg: 'Your application has been received.', time: '10:30 AM', unread: 2 },
    { id: '2', name: 'Admin - John', lastMsg: 'Please upload your land title.', time: 'Yesterday', unread: 0 },
    { id: '3', name: 'Market Updates', lastMsg: 'Coffee prices are up by 5% today!', time: 'Mar 20', unread: 0 },
  ];

  const adminChats = [
    { id: 'f1', name: 'Moses Muga', lastMsg: 'I need help with my loan application.', time: '5m ago', unread: 1, region: 'Central' },
    { id: 'f2', name: 'Sarah Namono', lastMsg: 'Thank you for the seeds.', time: '1h ago', unread: 0, region: 'Eastern' },
    { id: 'f3', name: 'David Okello', lastMsg: 'When is the next training?', time: '2h ago', unread: 0, region: 'Northern' },
  ];

  const currentChats = isAdmin ? adminChats : chats;

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-black/5 flex flex-col">
        <div className="p-6 border-b border-black/5">
          <h2 className="text-2xl font-black mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
            <input 
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-3 bg-black/5 rounded-2xl outline-none text-sm font-medium"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left",
                activeChat === chat.id ? "bg-[#5A5A40] text-white shadow-lg" : "hover:bg-black/5"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                activeChat === chat.id ? "bg-white/20" : "bg-black/5"
              )}>
                <User size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm truncate">{chat.name}</span>
                  <span className={cn(
                    "text-[10px] font-bold opacity-40",
                    activeChat === chat.id && "opacity-70"
                  )}>{chat.time}</span>
                </div>
                <p className={cn(
                  "text-xs truncate",
                  activeChat === chat.id ? "text-white/70" : "text-black/40"
                )}>{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && activeChat !== chat.id && (
                <div className="w-5 h-5 bg-[#5A5A40] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-[#F9F8F6]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-white border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{currentChats.find(c => c.id === activeChat)?.name}</h3>
                  <p className="text-xs text-green-600 font-bold">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 hover:bg-black/5 rounded-full transition-colors"><Phone size={20} /></button>
                <button className="p-3 hover:bg-black/5 rounded-full transition-colors"><MessageSquare size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="flex justify-center">
                <span className="px-4 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-black/40">Today</span>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start max-w-[70%]">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-black/5 text-sm">
                    Hello! How can I help you today?
                  </div>
                  <span className="text-[10px] font-bold opacity-20 mt-1 ml-1">10:30 AM</span>
                </div>

                <div className="flex flex-col items-end max-w-[70%] self-end">
                  <div className="bg-[#5A5A40] text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm">
                    I'm having trouble uploading my land title documents. Can you assist?
                  </div>
                  <span className="text-[10px] font-bold opacity-20 mt-1 mr-1">10:32 AM</span>
                </div>

                <div className="flex flex-col items-start max-w-[70%]">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-black/5 text-sm">
                    Of course! Please ensure the file is in PDF or JPG format and under 5MB. You can also try sending it here.
                  </div>
                  <span className="text-[10px] font-bold opacity-20 mt-1 ml-1">10:35 AM</span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-black/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); setMessage(''); }}
                className="flex gap-4"
              >
                <input 
                  placeholder="Type your message..."
                  className="flex-1 p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 ring-[#5A5A40]/20 text-sm font-medium"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button className="p-4 bg-[#5A5A40] text-white rounded-2xl hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-black/5 rounded-[2rem] flex items-center justify-center text-black/10 mb-6">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-2xl font-black mb-2">Your Inbox</h3>
            <p className="text-black/40 max-w-xs">Select a conversation from the left to start messaging with JAMO support.</p>
          </div>
        )}
      </div>
    </div>
  );
};
