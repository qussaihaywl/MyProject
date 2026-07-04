'use client';

import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Send, Image as ImageIcon, Smile, Users, Menu, X, MessageCircle, Copy, Edit2, Trash2, Reply, Check, CheckCheck } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

interface Message {
  id: number;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'emoji' | 'link' | 'system' | 'ai';
  imageUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  emoji?: string | null;
  linkUrl?: string | null;
  linkTitle?: string | null;
  sender: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  } | null;
  createdAt: Date | string;
  isEdited: boolean;
  replyToId?: number | null;
  replyTo?: Message;
  isAI?: boolean;
  reactions?: Record<string, string[]>;
  isPinned?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatRoom {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: Date | string;
  icon?: string | null;
  memberCount?: number;
  isPublic: boolean;
  isAnnouncements?: boolean;
  createdBy?: number;
  maxMembers?: number;
  isActive?: boolean;
  updatedAt?: Date;
}

interface OnlineUser {
  id: number | null;
  name: string | null;
  email: string | null;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusMessage?: string | null;
  lastSeenAt?: Date | string;
}

const EMOJIS = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '🚀', '😍', '🤔', '😢', '😡', '👏', '🙏', '💪', '⭐'];

// Helper function to generate avatar from name
const getAvatar = (name: string | null | undefined) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

// Helper function to get avatar background color
const getAvatarColor = (id: number | null | undefined) => {
  if (!id) return 'bg-gray-500';
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  return colors[id % colors.length];
};

export function GroupChat() {
  const { user, loading } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [showRoomsList, setShowRoomsList] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [contextMenuMessageId, setContextMenuMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load rooms from tRPC
  const { data: roomsData } = trpc.groupChat.getRooms.useQuery(undefined, {
    enabled: !!user && !loading,
  });

  // Load messages for selected room
  const { data: messagesData } = trpc.groupChat.getMessages.useQuery(
    { roomId: selectedRoom?.id || 0 },
    {
      enabled: !!user && !!selectedRoom && !loading,
      refetchInterval: 2000,
    }
  );

  // Load online users
  const { data: usersData } = trpc.groupChat.getOnlineUsers.useQuery(undefined, {
    enabled: !!user && !loading,
    refetchInterval: 5000,
  });

  // Send message mutation
  const sendMessageMutation = trpc.groupChat.sendMessage.useMutation({
    onSuccess: () => {
      setMessageInput('');
      setReplyingTo(null);
    },
    onError: () => {
      toast.error('فشل إرسال الرسالة');
    },
  });



  useEffect(() => {
    if (roomsData && Array.isArray(roomsData)) {
      const filteredRooms = roomsData.filter((room) => room && room.name !== 'المساعدة');
      setRooms(filteredRooms);
      if (!selectedRoom && filteredRooms.length > 0) {
        setSelectedRoom(filteredRooms[0]);
      }
    }
  }, [roomsData, selectedRoom]);

  useEffect(() => {
    if (messagesData && Array.isArray(messagesData)) {
      setMessages(messagesData.filter((msg) => msg !== null && msg !== undefined));
    }
  }, [messagesData]);

  useEffect(() => {
    if (usersData && Array.isArray(usersData)) {
      setOnlineUsers(usersData.filter((user) => user !== null && user !== undefined));
    }
  }, [usersData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      return dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom || !user) return;

    try {
      await sendMessageMutation.mutateAsync({
        roomId: selectedRoom.id,
        content: messageInput,
        messageType: 'text',
        replyToId: replyingTo?.id,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(messageInput + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedRoom && user) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        sendMessageMutation.mutate({
          roomId: selectedRoom.id,
          content: file.name,
          messageType: 'image',
          imageUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.content);
    toast.success('تم نسخ الرسالة');
  };

  const handleReplyMessage = (message: Message) => {
    setReplyingTo(message);
    setContextMenuMessageId(null);
  };

  const handleDeleteMessage = (messageId: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    toast.success('تم حذف الرسالة');
    setContextMenuMessageId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-dvh bg-gradient-to-br from-rose-900 via-rose-800 to-rose-700">
        <div className="text-white text-center">
          <div className="animate-spin mb-4">
            <MessageCircle size={48} />
          </div>
          <p className="text-lg">جاري تحميل الدردشة...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-dvh bg-gradient-to-br from-rose-900 via-rose-800 to-rose-700 px-4">
        <Card className="p-6 w-full max-w-sm bg-white/95 backdrop-blur border-0 shadow-2xl">
          <h2 className="text-xl font-bold text-rose-900 mb-3 text-center">الدردشة الجماعية</h2>
          <p className="text-gray-600 text-center mb-4 text-sm">يجب تسجيل الدخول للوصول إلى الدردشة</p>
          <a href="/login" className="block">
            <Button className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-5 text-base">
              تسجيل الدخول
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-3 py-3 shadow-lg flex items-center justify-between gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowRoomsList(true)}
          className="text-white hover:bg-rose-700/50 hover:text-white h-10 w-10"
        >
          <Menu size={22} />
        </Button>

        {selectedRoom && (
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate">{selectedRoom.name}</h1>
            <p className="text-xs text-rose-100 truncate">
              {onlineUsers.length} متصل
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowUsersList(true)}
          className="text-white hover:bg-rose-700/50 hover:text-white h-10 w-10 relative"
        >
          <Users size={22} />
          {onlineUsers.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
              {onlineUsers.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-3 py-3 overflow-hidden">
        <div className="space-y-1 pr-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-gray-400 py-12">
              <div>
                <MessageCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">لا توجد رسائل حتى الآن</p>
                <p className="text-xs">ابدأ المحادثة الآن!</p>
              </div>
            </div>
          ) : (
            messages.filter((msg) => msg && msg.sender).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender?.id === user?.id ? 'justify-end' : 'justify-start'} gap-1 group mb-1`}
                onMouseEnter={() => setContextMenuMessageId(message.id)}
                onMouseLeave={() => setContextMenuMessageId(null)}
              >
                {/* Avatar - Left side for others */}
                {message && message.sender && message.sender.id !== user?.id && (
                  <div className={`w-7 h-7 rounded-full ${getAvatarColor(message.sender.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1`}>
                    {getAvatar(message.sender.name)}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-xs`}>
                  {/* Show sender name for group messages */}
                  {message.sender?.id !== user?.id && (
                    <p className="text-xs font-semibold text-gray-700 mb-0.5 px-2">{message.sender?.name}</p>
                  )}

                  {/* Reply To */}
                  {message.replyTo && (
                    <div className={`mb-1 px-2 py-1 rounded text-xs border-l-2 ${
                      message.sender?.id === user?.id
                        ? 'bg-rose-500/20 border-rose-300'
                        : 'bg-gray-200/50 border-gray-400'
                    }`}>
                      <p className="font-semibold text-gray-700">{message.replyTo.sender?.name}</p>
                      <p className="text-gray-600 line-clamp-1">{message.replyTo.content}</p>
                    </div>
                  )}

                  {/* Main Message */}
                  <div
                    className={`px-3 py-2 rounded-2xl shadow-sm text-sm break-words ${
                      message.sender?.id === user?.id
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-br-none'
                        : message.sender?.name === 'waed'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-bl-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.messageType === 'image' && message.imageUrl ? (
                      <img src={message.imageUrl} alt="صورة" className="rounded max-w-xs max-h-48" />
                    ) : message.messageType === 'emoji' ? (
                      <span className="text-3xl">{message.emoji}</span>
                    ) : (
                      <p>{message.content}</p>
                    )}

                    {message.isEdited && (
                      <p className="text-xs opacity-70 mt-0.5">تم التعديل</p>
                    )}

                    <div className="flex items-center justify-between gap-1 mt-1">
                      <p className="text-xs opacity-70">
                        {formatTime(message.createdAt)}
                      </p>
                      {message.sender?.id === user?.id && (
                        <div className="flex gap-0.5">
                          {message.status === 'read' ? (
                            <CheckCheck size={12} />
                          ) : message.status === 'delivered' ? (
                            <CheckCheck size={12} />
                          ) : (
                            <Check size={12} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Context Menu */}
                  {contextMenuMessageId === message.id && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReplyMessage(message)}
                        className="text-xs h-7 px-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Reply size={12} className="ml-1" />
                        رد
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyMessage(message)}
                        className="text-xs h-7 px-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Copy size={12} className="ml-1" />
                        نسخ
                      </Button>
                      {message.sender?.id === user?.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-xs h-7 px-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={12} className="ml-1" />
                          حذف
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Avatar - Right side for current user */}
                {message && message.sender && message.sender.id === user?.id && (
                  <div className={`w-7 h-7 rounded-full ${getAvatarColor(message.sender.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1`}>
                    {getAvatar(message.sender.name)}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>



      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
          <span>{typingUsers.join(', ')} يكتب...</span>
        </div>
      )}

      {/* Reply To Indicator */}
      {replyingTo && (
        <div className="px-3 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs">
          <div className="flex-1">
            <p className="font-semibold text-rose-900">الرد على {replyingTo.sender?.name}</p>
            <p className="text-rose-700 line-clamp-1">{replyingTo.content}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setReplyingTo(null)}
            className="text-rose-600 hover:bg-rose-100 h-7 w-7"
          >
            <X size={14} />
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-rose-200 bg-white px-2 py-2 shadow-lg space-y-2 flex-shrink-0">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="grid grid-cols-8 gap-1 p-2 bg-rose-50 rounded border border-rose-200">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex-shrink-0 h-9 w-9"
          >
            <Smile size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex-shrink-0 h-9 w-9"
          >
            <ImageIcon size={18} />
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="اكتب رسالتك..."
            className="flex-1 rounded-full border-rose-200 focus:border-rose-500 focus:ring-rose-500 text-right text-sm py-2 h-9"
            dir="rtl"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendMessageMutation.isPending}
            className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-full flex-shrink-0 shadow-md hover:shadow-lg transition-all h-9 w-9 p-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>

      {/* Rooms List Drawer */}
      <Sheet open={showRoomsList} onOpenChange={setShowRoomsList}>
        <SheetContent side="right" className="w-full sm:w-72 p-0 bg-white">
          <SheetHeader className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-3 rounded-b-lg">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white text-base">الغرف</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRoomsList(false)}
                className="text-white hover:bg-rose-700/50 hover:text-white h-8 w-8"
              >
                <X size={18} />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="space-y-1 p-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowRoomsList(false);
                  }}
                  className={`w-full text-right p-2 rounded-lg transition-all text-sm ${
                    selectedRoom?.id === room.id
                      ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md'
                      : 'bg-rose-50 text-gray-800 hover:bg-rose-100'
                  }`}
                >
                  <p className="font-semibold text-sm">{room.name}</p>
                  <p className="text-xs opacity-75 line-clamp-1">{room.description}</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Users List Drawer */}
      <Sheet open={showUsersList} onOpenChange={setShowUsersList}>
        <SheetContent side="left" className="w-full sm:w-72 p-0 bg-white">
          <SheetHeader className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-3 rounded-b-lg">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white text-base">المتصلون ({onlineUsers.length})</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUsersList(false)}
                className="text-white hover:bg-rose-700/50 hover:text-white h-8 w-8"
              >
                <X size={18} />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="space-y-1 p-3">
              {onlineUsers.filter((u) => u && u.id).map((onlineUser) => (
                <div
                  key={onlineUser?.id}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-2"
                >
                  <div className={`w-8 h-8 rounded-full ${getAvatarColor(onlineUser?.id)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {getAvatar(onlineUser?.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          onlineUser.status === 'online'
                            ? 'bg-green-500'
                            : onlineUser.status === 'away'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}
                      />
                      <p className="font-semibold text-xs text-gray-800 truncate">{onlineUser.name}</p>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{onlineUser.email}</p>
                    {onlineUser.statusMessage && (
                      <p className="text-xs text-gray-500 italic mt-0.5 line-clamp-1">{onlineUser.statusMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
