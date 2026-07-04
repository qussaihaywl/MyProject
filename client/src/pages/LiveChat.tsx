import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Image,
  Paperclip,
  Smile,
  Trash2,
  Edit2,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function LiveChat() {
  const { user: currentUser } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const messagesQuery = trpc.chat.getMessages.useQuery({ roomId: 1, limit: 100 });
  const onlineCountQuery = trpc.chat.getOnlineUsersCount.useQuery();

  // Mutations
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const deleteMessageMutation = trpc.chat.deleteMessage.useMutation();
  const editMessageMutation = trpc.chat.editMessage.useMutation();
  const markOnlineMutation = trpc.chat.markAsOnline.useMutation();

  const messages = messagesQuery.data || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark user as online every 30 seconds
  useEffect(() => {
    markOnlineMutation.mutate();
    const interval = setInterval(() => {
      markOnlineMutation.mutate();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      messagesQuery.refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedImage) {
      toast.error("يرجى كتابة رسالة أو إضافة صورة");
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        roomId: 1,
        content: messageText.trim(),
      });

      setMessageText("");
      setSelectedImage(null);
      toast.success("✅ تم إرسال الرسالة");
      messagesQuery.refetch();
    } catch (error: any) {
      toast.error("❌ فشل إرسال الرسالة");
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    try {
      await deleteMessageMutation.mutateAsync({ messageId });
      toast.success("✅ تم حذف الرسالة");
      messagesQuery.refetch();
    } catch (error: any) {
      toast.error("❌ فشل حذف الرسالة");
    }
  };

  const handleEditMessage = async (messageId: number) => {
    if (!editText.trim()) return;

    try {
      await editMessageMutation.mutateAsync({
        messageId,
        content: editText.trim(),
      });

      setEditingId(null);
      setEditText("");
      toast.success("✅ تم تحديث الرسالة");
      messagesQuery.refetch();
    } catch (error: any) {
      toast.error("❌ فشل تحديث الرسالة");
    }
  };

  const isUserOnline = (lastActiveAt: Date | null) => {
    if (!lastActiveAt) return false;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastActiveAt) > fiveMinutesAgo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950">
      

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-amber-500 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">الدردشة المباشرة</h1>
                <p className="text-slate-400 text-sm">تواصل مع فريق الدعم والمستخدمين الآخرين</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 border">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                {onlineCountQuery.data || 0} مستخدم نشط
              </Badge>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <MessageCircle className="w-12 h-12 text-slate-500" />
                <p className="text-slate-400">لا توجد رسائل حتى الآن</p>
                <p className="text-slate-500 text-sm">كن أول من يبدأ محادثة</p>
              </div>
            ) : (
              messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.userId === currentUser?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.userId !== currentUser?.id && (
                    <div className="relative">
                      <img
                        src={message.userAvatar || "https://via.placeholder.com/40"}
                        alt={message.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      {isUserOnline(message.isOnline) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-800"></div>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.userId === currentUser?.id
                        ? "bg-gradient-to-r from-rose-500 to-amber-500"
                        : "bg-slate-700/50 border border-slate-600"
                    } rounded-lg p-3`}
                  >
                    {message.userId !== currentUser?.id && (
                      <p className="text-xs font-semibold text-slate-300 mb-1">
                        {message.userName}
                        {message.userRole === "admin" && (
                          <Badge className="ml-2 bg-rose-500/20 text-rose-400 text-xs">
                            مسؤول
                          </Badge>
                        )}
                      </p>
                    )}

                    {editingId === message.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditMessage(message.id)}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="صورة"
                            className="rounded mb-2 max-w-xs"
                          />
                        )}
                        <p className="text-white break-words">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString("ar-SA")}
                          </p>
                          {message.userId === currentUser?.id && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingId(message.id);
                                  setEditText(message.content);
                                }}
                                className="text-xs hover:opacity-70"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="text-xs hover:opacity-70"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4 space-y-3">
            {selectedImage && (
              <div className="relative w-20 h-20">
                <img src={selectedImage} alt="معاينة" className="w-full h-full rounded" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="اكتب رسالتك هنا..."
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />

              <Button
                size="icon"
                variant="ghost"
                className="text-slate-400 hover:text-amber-400"
              >
                <Image className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-slate-400 hover:text-amber-400"
              >
                <Paperclip className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending}
                className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
