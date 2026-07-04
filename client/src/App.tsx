import { TooltipProvider } from "@/components/ui/tooltip";
// Rose Online - متجر الملابس والأثاث والإكسسوارات - تم التحديث
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter"; // Updated for new deployment
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import { Toaster } from "sonner";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Inquiries from "./pages/Inquiries";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UserDashboard from "./pages/UserDashboard";
import OrderTracking from "./pages/OrderTracking";
import Wishlist from "./pages/Wishlist";
import Comparison from "./pages/Comparison";
import Coupons from "./pages/Coupons";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import Recommendations from "./pages/Recommendations";
import { GroupChat } from "./pages/GroupChat";

import OrdersDashboard from "./pages/OrdersDashboard";
import { Favorites } from "./pages/Favorites";

import AdminDashboardPage from "./pages/AdminDashboard";


import AdvancedAdminDashboard from "./pages/AdvancedAdminDashboard";
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";
import FinalAdminDashboard from "./pages/FinalAdminDashboard";
import AdminActivityLog from "./pages/AdminActivityLog";
import Analytics from "./pages/Analytics";
import Contact from "./pages/Contact";
import FacebookContact from "@/pages/FacebookContact";
import WarehouseCommissions from "./pages/WarehouseCommissions";
import WarehouseCommissionsDashboard from "./pages/WarehouseCommissionsDashboard";
// import DelegateCommissions from "./pages/DelegateCommissions"; // Removed
import DelegateCommissionsDashboard from "./pages/DelegateCommissionsDashboard";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import PasswordManagement from "./pages/PasswordManagement";

import ShowcaseManagement from "./pages/ShowcaseManagement";

import ProductReviews from "./pages/ProductReviews";
import DelegateStatsDashboard from "./pages/DelegateStatsDashboard";

import LiveChat from "./pages/LiveChat";
import SmartRecommendations from "./pages/SmartRecommendations";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import SmartAlerts from "./pages/SmartAlerts";
import MonthlyReports from "./pages/MonthlyReports";
// WhatsApp imports removed
import AdminNotifications from "./pages/AdminNotifications";
import CategoriesManagement from "./pages/CategoriesManagement";
import ImportUsers from "./pages/ImportUsers";
import AuditLog from "./pages/AuditLog";
import UsersManagement from "./pages/UsersManagement";
import AddProductForm from "./pages/AddProductForm";


import ProductManagementDashboard from "./pages/ProductManagementDashboard";


import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import BackupManagement from "./pages/BackupManagement";
// Using AdminDashboardPage from pages instead
import { useAuth } from "@/_core/hooks/useAuth";
import { MessageCircle, Home as HomeIcon, Phone, Users as UsersIcon, Bell, Package } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ProtectedRoute } from "./components/ProtectedRoute";

// This component is no longer needed, using ProtectedRoute instead

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/categories"} component={Categories} />
      <Route path={"/category/:id"} component={CategoryDetail} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/dashboard"} component={UserDashboard} />
      <Route path={"/order/:id"} component={OrderTracking} />


      <Route path={"/contact"} component={Contact} />
      <Route path={"/facebook-contact"} component={FacebookContact} />
      <Route path={`/warehouse-commissions`} component={WarehouseCommissions} />
        <Route path={`/warehouse-commissions-dashboard`} component={WarehouseCommissionsDashboard} />
      {/* <Route path={`/delegate-commissions`} component={DelegateCommissions} /> */}
        <Route path="/delegate-commissions-dashboard" component={DelegateCommissionsDashboard} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/comparison" component={Comparison} />
      <Route path="/coupons" component={Coupons} />
      <Route path="/loyalty" component={LoyaltyProgram} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/group-chat" component={GroupChat} />



      <Route path="/favorites" component={Favorites} />
      {/* Admin Dashboard - للمسؤول فقط */}
      <Route path={"/admin"} component={() => <ProtectedRoute component={FinalAdminDashboard} requiredRole="admin" />} />
      <Route path={"/admin/dashboard"} component={() => <ProtectedRoute component={AdminDashboardPage} requiredRole="admin" />} />
      <Route path={"/admin/analytics"} component={() => <ProtectedRoute component={Analytics} requiredRole="admin" />} />
      <Route path={"/admin/users"} component={() => <ProtectedRoute component={UsersManagement} requiredRole="admin" />} />
      <Route path={"/showcase-management"} component={() => <ProtectedRoute component={ShowcaseManagement} requiredRole="admin" />} />

  
      <Route path={"/register"} component={Register} />
      <Route path={"/login"} component={Login} />
      <Route path={"/inquiries"} component={Inquiries} />
      <Route path={"/account"} component={Account} />
      <Route path="/password-management" component={PasswordManagement} />

      <Route path="/product-reviews/:productId?" component={(props: any) => <ProductReviews productId={props.params.productId ? parseInt(props.params.productId) : undefined} />} />
      <Route path="/delegate-stats" component={DelegateStatsDashboard} />
      <Route path="/live-chat" component={LiveChat} />
      <Route path="/smart-recommendations" component={SmartRecommendations} />
      <Route path="/invoice-generator" component={InvoiceGenerator} />
      <Route path="/smart-alerts" component={SmartAlerts} />
      <Route path="/monthly-reports" component={MonthlyReports} />
      {/* Admin Notifications - للمسؤول فقط */}
      <Route path="/admin/notifications" component={() => <ProtectedRoute component={AdminNotifications} requiredRole="admin" />} />
      <Route path="/notifications" component={AdminNotifications} />
      
      {/* Products Management - للمشرف والمسؤول */}

      <Route path="/admin/categories" component={() => <ProtectedRoute component={CategoriesManagement} minRole="supervisor" />} />


      <Route path="/products-management" component={ProductManagementDashboard} />
      <Route path="/advanced-dashboard" component={() => <ProtectedRoute component={AdminDashboardPage} requiredRole="admin" />} />
      <Route path="/admin-dashboard" component={() => <ProtectedRoute component={AdminDashboardPage} requiredRole="admin" />} />
      
      {/* Admin Activity Log - للمسؤول فقط */}
      <Route path="/admin/activity-log" component={() => <ProtectedRoute component={AdminActivityLog} requiredRole="admin" />} />
      <Route path="/admin/import-users" component={() => <ProtectedRoute component={ImportUsers} requiredRole="admin" />} />
      <Route path="/admin/audit-log" component={() => <ProtectedRoute component={AuditLog} requiredRole="admin" />} />
      {/* WhatsApp routes removed */}
      <Route path="/add-product" component={() => <AddProductForm />} />
      <Route path="/admin/add-product" component={() => <AddProductForm />} />
      {/* <Route path="/admin/collapsible" component={() => <ProtectedRoute component={CollapsibleAdminDashboard} requiredRole="admin" />} /> */}

      <Route path="/admin/analytics-advanced" component={() => <ProtectedRoute component={AdvancedAnalytics} requiredRole="admin" />} />
      <Route path="/admin/backups" component={() => <ProtectedRoute component={BackupManagement} requiredRole="admin" />} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Bottom Navigation Bar Component
interface NavItem {
  label: string;
  icon: any;
  href?: string;
  action?: string;
  color?: string;
}

interface BottomNavBarProps {
  onChatClick: () => void;
}

function BottomNavBar({ onChatClick }: BottomNavBarProps) {
  const [location] = useLocation();

  const navItems = [
    { label: "الرئيسية", icon: HomeIcon, href: "/" },
    { label: "الإشعارات", icon: Bell, href: "/notifications", color: "text-yellow-400" },
    { label: "استفسارات سريعة", icon: MessageCircle, action: "chat", color: "text-green-500" },
    { label: "الجماعية", icon: UsersIcon, href: "/group-chat", color: "text-purple-500" },
    { label: "الاتصال", icon: Phone, href: "/contact", color: "text-blue-500" },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return location === href || location.startsWith(href + "/");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 border-t border-amber-500 shadow-2xl shadow-amber-600/50 z-50 pointer-events-auto hover:shadow-3xl hover:shadow-amber-700/60 transition-all duration-300">
      <div className="flex items-center justify-around h-16 px-6 pointer-events-auto gap-4">
        {navItems.map((item: NavItem) => {
          const Icon = item.icon;
          
          if (item.action === "chat") {
            return (
              <button
                key={item.label}
                onClick={() => {
                  console.log('Chat button clicked!');
                  onChatClick();
                }}
                className="flex flex-col items-center justify-center flex-1 h-16 transition-all duration-200 relative group text-amber-100 hover:text-white hover:scale-110 hover:drop-shadow-lg"
                title={item.label}
              >
                <Icon className={`w-6 h-6 ${item.color || ""}`} />
                <span className="text-xs mt-1 text-center">{item.label}</span>
              </button>
            );
          }
          
          const active = isActive(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              target={item.href && item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href && item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex flex-col items-center justify-center flex-1 h-16 transition-all duration-200 relative group hover:scale-110 hover:drop-shadow-lg ${active ? "text-white" : "text-amber-100 hover:text-white"}`}
              title={item.label}
            >
              <Icon className={`w-6 h-6 ${item.color || ""}`} />
              <span className="text-xs mt-1 text-center">{item.label}</span>
              {active && (
                <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-200 shadow-lg shadow-yellow-300/50"></div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  suggestions?: string[];
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const aiChatMutation = trpc.chat.sendAIMessage.useMutation();

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // إضافة رسالة المستخدم
    const newMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(newMessages);
    setIsLoadingAI(true);

    try {
      // استدعاء AI Chat
      const response = await aiChatMutation.mutateAsync({
        content: message,
        conversationHistory: messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      });

      // إضافة رد AI
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: response.text,
          suggestions: response.suggestions,
        },
      ]);
    } catch (error) {
      console.error("خطأ في AI Chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content:
            "عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة لاحقاً.",
        },
      ]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Navigation />
          <div className="pb-20">
            <Router />
          </div>

          {/* Bottom Navigation Bar */}
          <BottomNavBar onChatClick={() => setShowChat(true)} />

          {/* Chat Modal */}
          {showChat && (
            <div className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-t-lg shadow-xl w-full h-[90vh] md:h-96 flex flex-col max-h-screen">
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-t-lg">
                  <h2 className="text-lg font-semibold">الدردشة المباشرة - روز</h2>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-white hover:text-gray-200 text-xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <p className="text-lg font-semibold mb-2">مرحباً بك في روز!</p>
                        <p className="text-sm">كيف يمكنني مساعدتك اليوم؟</p>
                      </div>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={idx}>
                      <div
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 ml-4">
                          {msg.suggestions.map((suggestion, sidx) => (
                            <button
                              key={sidx}
                              onClick={() => handleSendMessage(suggestion)}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoadingAI && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-1.5 px-2 py-1.5 border-t flex-shrink-0 bg-white items-end">
                  <textarea
                    placeholder="اكتب رسالتك..."
                    disabled={isLoadingAI}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 resize-none max-h-16 min-h-8 overflow-y-auto"
                    rows={1}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !isLoadingAI) {
                        e.preventDefault();
                        handleSendMessage((e.target as HTMLTextAreaElement).value);
                        (e.target as HTMLTextAreaElement).value = "";
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                      if (!isLoadingAI && textarea.value.trim()) {
                        handleSendMessage(textarea.value);
                        textarea.value = "";
                      }
                    }}
                    disabled={isLoadingAI}
                    className="bg-blue-500 text-white px-2 py-1 text-sm rounded-md hover:bg-blue-600 transition disabled:bg-gray-400 flex-shrink-0 h-8"
                  >
                    {isLoadingAI ? "..." : "إرسال"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
