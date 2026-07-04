import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef, useCallback } from "react";
import { MessageCircle, Send, Loader2, Search, Phone, Mail, Clock, User, Smile, Paperclip } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";

interface Message {
  id: number;
  roomId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: Date;
}

interface ChatRoom {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
}

export default function Inquiries() {
  return (
    <>
      
      <InquiriesContent />
    </>
  );
}

function InquiriesContent() {
  const { user, isAuthenticated } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Fetch rooms
  const { data: roomsData } = trpc.chat.getRooms.useQuery();
  const { data: messagesData, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { roomId: selectedRoom || 1, limit: 100 },
    { enabled: !!selectedRoom, refetchInterval: 3000 }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();

  // Update rooms
  useEffect(() => {
    if (roomsData) {
      setRooms(roomsData);
      if (!selectedRoom && roomsData.length > 0) {
        setSelectedRoom(roomsData[0].id);
      }
      setLoading(false);
    }
  }, [roomsData, selectedRoom]);

  // Update messages
  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.reverse());
    }
  }, [messagesData]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedRoom || !isAuthenticated) return;

    const tempMessage = messageInput;
    setMessageInput("");
    setIsTyping(false);

    try {
      await sendMessageMutation.mutateAsync({
        roomId: selectedRoom,
        content: tempMessage,
      });

      toast.success("✓ تم إرسال الرسالة!");
      // Refresh messages
      setTimeout(() => refetchMessages(), 500);
    } catch (error) {
      setMessageInput(tempMessage);
      toast.error("❌ خطأ في إرسال الرسالة");
      console.error("Error sending message:", error);
    }
  }, [messageInput, selectedRoom, isAuthenticated, sendMessageMutation, refetchMessages]);

  // Filter rooms by search
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center py-8 pt-24">
        <Card className="p-3 sm:p-2 sm:p-2.5 md:p-3 lg:p-4 md:p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 lg:p-8 bg-white border-2 border-rose-300 text-center max-w-md shadow-2xl rounded-2xl">
          <MessageCircle className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl font-bold text-rose-600 mb-2">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">يرجى تسجيل الدخول للوصول إلى غرف الدردشة والاستفسارات</p>
          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold py-3 rounded-md sm:rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              تسجيل الدخول
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center pt-24">
        <Loader2 className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">
            🎯 مركز الاستفسارات والدردشة المباشرة
          </h1>
          <p className="text-gray-700 mt-2 text-sm sm:text-base md:text-lg">تواصل مع فريقنا واستفسر عن أي شيء في الوقت الفعلي - نحن هنا لمساعدتك 24/7</p>
        </div>

        {/* Main Chat Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:p-2.5 md:p-3 lg:p-4 h-[650px]">
          {/* Rooms Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-2 border-rose-300 overflow-hidden h-full flex flex-col shadow-lg rounded-2xl">
              {/* Sidebar Header */}
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-2 sm:p-2.5 md:p-3 lg:p-4">
                <h2 className="font-bold text-sm sm:text-base md:text-lg mb-3">🏢 الغرف المتاحة</h2>
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-4 h-4 text-rose-200" />
                  <input
                    type="text"
                    placeholder="ابحث عن غرفة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-md sm:rounded-lg bg-white bg-opacity-20 text-white placeholder-rose-100 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
              </div>

              {/* Rooms List */}
              <div className="overflow-y-auto flex-1 divide-y divide-rose-100">
                {filteredRooms.length === 0 ? (
                  <div className="p-2 sm:p-2.5 md:p-3 lg:p-4 text-center text-gray-400">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>لا توجد غرف متطابقة</p>
                  </div>
                ) : (
                  filteredRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`w-full text-right p-2 sm:p-2.5 md:p-3 lg:p-4 transition duration-200 ${
                        selectedRoom === room.id
                          ? "bg-gradient-to-r from-rose-100 to-orange-100 border-l-4 border-rose-500 shadow-md"
                          : "hover:bg-rose-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 justify-end">
                        <div className="flex-1 text-right">
                          <p className="font-bold text-rose-600 text-sm">{room.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{room.description}</p>
                        </div>
                        <span className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl">{room.icon || "💬"}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="border-t border-rose-100 p-3 bg-gradient-to-r from-rose-50 to-orange-50">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-rose-500" />
                    <span>+962778989135</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-rose-500" />
                    <span className="truncate">RoseOnline@gmail.com</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-2 border-rose-300 h-full flex flex-col overflow-hidden shadow-lg rounded-2xl">
              {/* Chat Header */}
              {selectedRoom && (
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-2 sm:p-2.5 md:p-3 lg:p-4 border-b-2 border-rose-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-sm sm:text-base md:text-lg md:text-xl font-bold">
                        {rooms.find((r) => r.id === selectedRoom)?.name}
                      </h2>
                      <p className="text-rose-100 text-sm">
                        {rooms.find((r) => r.id === selectedRoom)?.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-sm">نشط الآن</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 space-y-4 bg-gradient-to-b from-white to-rose-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-sm sm:text-base md:text-lg">لا توجد رسائل بعد</p>
                    <p className="text-sm">كن أول من يرسل رسالة!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.userId === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-md sm:rounded-lg ${
                          msg.userId === user?.id
                            ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-br-none shadow-md"
                            : "bg-white border-2 border-rose-200 text-gray-800 rounded-bl-none shadow-md"
                        }`}
                      >
                        {msg.userId !== user?.id && (
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3 text-rose-600" />
                            <p className="text-xs font-bold text-rose-600">
                              {msg.userName}
                            </p>
                          </div>
                        )}
                        <p className="text-sm break-words">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          msg.userId === user?.id
                            ? "text-rose-100"
                            : "text-gray-400"
                        }`}>
                          <Clock className="w-3 h-3" />
                          {new Date(msg.createdAt).toLocaleTimeString("ar-EG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-end">
                    <div className="bg-rose-100 text-rose-600 px-4 py-2 rounded-md sm:rounded-lg text-sm">
                      جاري الكتابة...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t-2 border-rose-200 p-2 sm:p-2.5 md:p-3 lg:p-4 bg-white rounded-b-2xl">
                <div className="flex gap-2 mb-2">
                  <Input
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال)"
                    className="flex-1 border-2 border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-300 rounded-md sm:rounded-lg py-3 px-4 transition-all duration-200"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-6 rounded-md sm:rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md sm:rounded-lg transition">
                    <Smile className="w-4 h-4" />
                    <span>إضافة رد فعل</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md sm:rounded-lg transition">
                    <Paperclip className="w-4 h-4" />
                    <span>إرسال ملف</span>
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  💡 اضغط Enter لإرسال الرسالة بسرعة - Shift+Enter للسطر الجديد
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Community Guidelines */}
        <Card className="mt-6 p-2.5 sm:p-3 md:p-2 sm:p-2.5 md:p-3 lg:p-4 lg:p-6 bg-white border-2 border-rose-300 shadow-xl rounded-2xl">
          <h3 className="font-bold text-rose-600 mb-4 flex items-center gap-2 text-sm sm:text-base md:text-lg">
            <MessageCircle className="w-5 h-5" />
            📋 إرشادات المجتمع والسلوك الحسن
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:p-2.5 md:p-3 lg:p-4 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl">✓</span>
              <div>
                <p className="font-bold text-rose-600">احترام متبادل</p>
                <p className="text-xs">كن محترماً وودياً مع جميع الأعضاء</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl">🔒</span>
              <div>
                <p className="font-bold text-rose-600">الخصوصية</p>
                <p className="text-xs">لا تشارك معلومات شخصية حساسة</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl">⚡</span>
              <div>
                <p className="font-bold text-rose-600">الاحترافية</p>
                <p className="text-xs">تجنب الرسائل المسيئة أو المزعجة</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-sm sm:text-base md:text-lg sm:text-base sm:text-sm sm:text-base md:text-lg md:text-xl md:text-2xl">⏱️</span>
              <div>
                <p className="font-bold text-rose-600">الاستجابة السريعة</p>
                <p className="text-xs">نحن نرد على الاستفسارات خلال ساعات</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Support Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-2 sm:p-2.5 md:p-3 lg:p-4">
          <Card className="p-2 sm:p-2.5 md:p-3 lg:p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl">
            <Phone className="w-6 h-6 text-rose-500 mb-2" />
            <h4 className="font-bold text-rose-600 mb-1">اتصل بنا</h4>
            <p className="text-sm text-gray-600">+962778989135</p>
          </Card>
          <Card className="p-2 sm:p-2.5 md:p-3 lg:p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl">
            <Mail className="w-6 h-6 text-orange-500 mb-2" />
            <h4 className="font-bold text-orange-600 mb-1">البريد الإلكتروني</h4>
            <p className="text-sm text-gray-600">RoseOnline@gmail.com</p>
          </Card>
          <Card className="p-2 sm:p-2.5 md:p-3 lg:p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
            <Clock className="w-6 h-6 text-green-500 mb-2" />
            <h4 className="font-bold text-green-600 mb-1">ساعات العمل</h4>
            <p className="text-sm text-gray-600">24/7 متاح دائماً</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
