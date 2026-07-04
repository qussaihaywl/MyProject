import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Rose Online Database Schema - Professional & Advanced
 * Optimized for e-commerce with comprehensive relationships and constraints
 */

// ==================== CORE USERS & AUTHENTICATION ====================

/**
 * Users Table - Core authentication and user management
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Manus OAuth identifier
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  walletNumber: varchar("walletNumber", { length: 50 }),
  walletType: varchar("walletType", { length: 50 }),
  loginMethod: varchar("loginMethod", { length: 64 }).default("local"),
  role: mysqlEnum("role", ["user", "delegate", "supervisor", "admin"]).default("user").notNull(),
  permissions: text("permissions"), // JSON array of permission codes
  status: mysqlEnum("status", ["active", "inactive", "suspended", "pending"]).default("active").notNull(),
  lastActivityAt: timestamp("lastActivityAt"),
  notes: text("notes"), // Admin notes about user
  isActive: boolean("isActive").default(true).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Email Verification Table
export const emailVerifications = mysqlTable("emailVerifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;

// Password Reset Table
export const passwordResets = mysqlTable("passwordResets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordReset = typeof passwordResets.$inferSelect;
export type InsertPasswordReset = typeof passwordResets.$inferInsert;

// Two Factor Authentication Table
export const twoFactorAuth = mysqlTable("twoFactorAuth", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  secret: varchar("secret", { length: 255 }).notNull(),
  backupCodes: text("backupCodes").notNull(), // JSON array
  enabled: boolean("enabled").default(false).notNull(),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TwoFactorAuth = typeof twoFactorAuth.$inferSelect;
export type InsertTwoFactorAuth = typeof twoFactorAuth.$inferInsert;

// ==================== CATALOG MANAGEMENT ====================

/**
 * Categories Table - Product categories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  showOnHomepage: boolean("showOnHomepage").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products Table - Product inventory with comprehensive details
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  warehouseCode: varchar("warehouseCode", { length: 50 }),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }), // For discounts
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"), // Discount percentage
  image: varchar("image", { length: 500 }),
  images: text("images"), // JSON array of image URLs
  videos: text("videos"), // JSON array of video URLs
  weight: varchar("weight", { length: 50 }),
  colors: text("colors"), // JSON array of available colors
  sizes: text("sizes"), // JSON array of available sizes
  stock: int("stock").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(10).notNull(), // Alert when stock is low
  sku: varchar("sku", { length: 100 }).unique(), // Stock Keeping Unit
  barcode: varchar("barcode", { length: 100 }).unique(), // Product barcode
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(), // Featured on homepage
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("0"), // Average rating
  totalReviews: int("totalReviews").default(0).notNull(), // Total review count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ==================== WAREHOUSE MANAGEMENT ====================

/**
 * Warehouses Table - Warehouse locations and management
 */
export const warehouses = mysqlTable("warehouses", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  location: varchar("location", { length: 200 }),
  managerId: int("managerId"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Warehouse = typeof warehouses.$inferSelect;
export type InsertWarehouse = typeof warehouses.$inferInsert;

// ==================== ORDERS & TRANSACTIONS ====================

/**
 * Advanced Orders Table - Main orders from the advanced form
 */
export const advancedOrders = mysqlTable("advancedOrders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).unique().notNull(),
  productId: int("productId"),
  productName: varchar("productName", { length: 200 }).notNull(),
  productPrice: decimal("productPrice", { precision: 10, scale: 2 }).notNull(),
  categoryId: int("categoryId"),
  customerId: int("customerId"),
  customerName: varchar("customerName", { length: 100 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 100 }),
  governorate: varchar("governorate", { length: 100 }).notNull(),
  detailedLocation: text("detailedLocation").notNull(),
  delegateId: int("delegateId"),
  delegateName: varchar("delegateName", { length: 100 }).notNull(),
  delegateCommission: decimal("delegateCommission", { precision: 10, scale: 2 }),
  warehouseId: int("warehouseId"),
  warehouseCode: varchar("warehouseCode", { length: 50 }).notNull(),
  orderDate: timestamp("orderDate").defaultNow().notNull(),
  orderNotes: text("orderNotes"),
  weight: varchar("weight", { length: 50 }),
  length: varchar("length", { length: 50 }),
  color: varchar("color", { length: 50 }),
  size: varchar("size", { length: 50 }),
  images: text("images"), // JSON array
  videos: text("videos"), // JSON array
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["unpaid", "partial", "paid"]).default("unpaid").notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  whatsappSent: boolean("whatsappSent").default(false).notNull(),
  emailSent: boolean("emailSent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdvancedOrder = typeof advancedOrders.$inferSelect;
export type InsertAdvancedOrder = typeof advancedOrders.$inferInsert;

/**
 * Standard Orders Table - Regular e-commerce orders
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).unique().notNull(),
  userId: int("userId").notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["unpaid", "partial", "paid"]).default("unpaid").notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: varchar("shippingCity", { length: 100 }).notNull(),
  shippingZipCode: varchar("shippingZipCode", { length: 20 }).notNull(),
  shippingPhone: varchar("shippingPhone", { length: 20 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order Items Table - Items in each order
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Order Status History Table - Track order status changes
 */
export const orderStatusHistory = mysqlTable("orderStatusHistory", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  previousStatus: varchar("previousStatus", { length: 50 }).notNull(),
  newStatus: varchar("newStatus", { length: 50 }).notNull(),
  changedBy: int("changedBy"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type InsertOrderStatusHistory = typeof orderStatusHistory.$inferInsert;

/**
 * Shipments Table - Shipping information
 */
export const shipments = mysqlTable("shipments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().unique(),
  trackingNumber: varchar("trackingNumber", { length: 100 }).unique(),
  shippingMethod: varchar("shippingMethod", { length: 50 }).notNull(),
  carrier: varchar("carrier", { length: 100 }),
  estimatedDeliveryDate: timestamp("estimatedDeliveryDate"),
  actualDeliveryDate: timestamp("actualDeliveryDate"),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["pending", "in_transit", "out_for_delivery", "delivered", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = typeof shipments.$inferInsert;

// ==================== CART & CUSTOMER MANAGEMENT ====================

/**
 * Cart Items Table - Shopping cart items
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Customer Addresses Table - Multiple addresses per customer
 */
export const customerAddresses = mysqlTable("customerAddresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["billing", "shipping", "other"]).default("shipping").notNull(),
  fullName: varchar("fullName", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  street: varchar("street", { length: 200 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type InsertCustomerAddress = typeof customerAddresses.$inferInsert;

// ==================== COMMISSIONS ====================

/**
 * Warehouse Commissions Table - Track warehouse earnings
 */
export const warehouseCommissions = mysqlTable("warehouseCommissions", {
  id: int("id").autoincrement().primaryKey(),
  warehouseId: int("warehouseId").notNull(),
  warehouseCode: varchar("warehouseCode", { length: 50 }).notNull(),
  warehouseName: varchar("warehouseName", { length: 100 }).notNull(),
  orderId: int("orderId"),
  orderNumber: varchar("orderNumber", { length: 50 }),
  commissionType: mysqlEnum("commissionType", ["percentage", "fixed"]).default("percentage").notNull(),
  commissionRate: decimal("commissionRate", { precision: 10, scale: 2 }).notNull(),
  totalOrderAmount: decimal("totalOrderAmount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }).notNull(),
  productCount: int("productCount").default(0),
  status: mysqlEnum("status", ["pending", "approved", "paid", "rejected"]).default("pending").notNull(),
  paymentDate: timestamp("paymentDate"),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionId: varchar("transactionId", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WarehouseCommission = typeof warehouseCommissions.$inferSelect;
export type InsertWarehouseCommission = typeof warehouseCommissions.$inferInsert;

/**
 * Delegate Commissions Table - Track delegate earnings
 */
export const delegateCommissions = mysqlTable("delegateCommissions", {
  id: int("id").autoincrement().primaryKey(),
  delegateId: int("delegateId").notNull(),
  delegateName: varchar("delegateName", { length: 100 }).notNull(),
  delegatePhone: varchar("delegatePhone", { length: 20 }),
  delegateEmail: varchar("delegateEmail", { length: 320 }),
  orderId: int("orderId"),
  orderNumber: varchar("orderNumber", { length: 50 }),
  commissionType: mysqlEnum("commissionType", ["percentage", "fixed"]).default("fixed").notNull(),
  commissionRate: decimal("commissionRate", { precision: 10, scale: 2 }).notNull(),
  totalOrderAmount: decimal("totalOrderAmount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }).notNull(),
  productCount: int("productCount").default(0),
  status: mysqlEnum("status", ["pending", "approved", "paid", "rejected"]).default("pending").notNull(),
  paymentDate: timestamp("paymentDate"),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionId: varchar("transactionId", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DelegateCommission = typeof delegateCommissions.$inferSelect;
export type InsertDelegateCommission = typeof delegateCommissions.$inferInsert;

// ==================== COMMUNICATION & INQUIRIES ====================

/**
 * Inquiries Table - Customer inquiries and support tickets
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * Chat Rooms Table - Chat room management
 */
export const chatRooms = mysqlTable("chatRooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = typeof chatRooms.$inferInsert;

/**
 * Messages Table - Chat messages
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ==================== CONTENT & MEDIA ====================

/**
 * Showcase Videos Table - Video showcase management
 */
export const showcaseVideos = mysqlTable("showcaseVideos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  videoUrl: varchar("videoUrl", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  duration: int("duration").default(60).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  category: varchar("category", { length: 100 }),
  videoType: mysqlEnum("videoType", ["direct", "youtube"]).default("direct").notNull(), // نوع الفيديو
  youtubeId: varchar("youtubeId", { length: 50 }), // معرف فيديو YouTube
  youtubeUrl: varchar("youtubeUrl", { length: 500 }), // رابط YouTube الكامل
  displayIds: text("displayIds"), // JSON array of display IDs linked to this video
  views: int("views").default(0).notNull(), // عدد المشاهدات
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShowcaseVideo = typeof showcaseVideos.$inferSelect;
export type InsertShowcaseVideo = typeof showcaseVideos.$inferInsert;

/**
 * Facebook Pages Table - Social media integration
 */
export const facebookPages = mysqlTable("facebookPages", {
  id: int("id").autoincrement().primaryKey(),
  pageId: varchar("pageId", { length: 100 }).notNull().unique(),
  pageName: varchar("pageName", { length: 255 }).notNull(),
  pageAccessToken: text("pageAccessToken").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FacebookPage = typeof facebookPages.$inferSelect;
export type InsertFacebookPage = typeof facebookPages.$inferInsert;

/**
 * Product Shares Table - Track product shares on social media
 */
export const productShares = mysqlTable("productShares", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  facebookPageId: int("facebookPageId").notNull(),
  postId: varchar("postId", { length: 100 }),
  shareUrl: text("shareUrl"),
  status: mysqlEnum("status", ["pending", "published", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductShare = typeof productShares.$inferSelect;
export type InsertProductShare = typeof productShares.$inferInsert;

// ==================== LOGGING & TRACKING ====================

/**
 * Email Logs Table - Track all email communications
 */
export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

// ==================== ADVANCED CHAT SYSTEM ====================

/**
 * Chat Conversations Table - Manage chat conversations between users and admins
 */
export const chatConversations = mysqlTable("chatConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  adminId: int("adminId"),
  subject: varchar("subject", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["open", "closed", "pending", "resolved"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;

/**
 * Chat Messages Table - Store individual messages in conversations
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  messageType: mysqlEnum("messageType", ["text", "image", "file", "link"]).default("text").notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  fileUrl: varchar("fileUrl", { length: 500 }),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"),
  linkUrl: varchar("linkUrl", { length: 500 }),
  linkTitle: varchar("linkTitle", { length: 255 }),
  isRead: boolean("isRead").default(false).notNull(),
  isEdited: boolean("isEdited").default(false).notNull(),
  editedAt: timestamp("editedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * User Online Status Table - Track user online/offline status
 */
export const userOnlineStatus = mysqlTable("userOnlineStatus", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  isOnline: boolean("isOnline").default(false).notNull(),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  statusMessage: varchar("statusMessage", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserOnlineStatus = typeof userOnlineStatus.$inferSelect;
export type InsertUserOnlineStatus = typeof userOnlineStatus.$inferInsert;

/**
 * Chat Attachments Table - Store metadata for chat attachments
 */
export const chatAttachments = mysqlTable("chatAttachments", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  attachmentType: mysqlEnum("attachmentType", ["image", "document", "video", "audio"]).notNull(),
  attachmentUrl: varchar("attachmentUrl", { length: 500 }).notNull(),
  attachmentName: varchar("attachmentName", { length: 255 }).notNull(),
  attachmentSize: int("attachmentSize").notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatAttachment = typeof chatAttachments.$inferSelect;
export type InsertChatAttachment = typeof chatAttachments.$inferInsert;

/**
 * Chat Notifications Table - Track unread messages and notifications
 */
export const chatNotifications = mysqlTable("chatNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conversationId: int("conversationId").notNull(),
  messageId: int("messageId").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  notificationType: mysqlEnum("notificationType", ["new_message", "mention", "status_change"]).default("new_message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatNotification = typeof chatNotifications.$inferSelect;
export type InsertChatNotification = typeof chatNotifications.$inferInsert;

// ==================== GROUP CHAT SYSTEM ====================

/**
 * Group Chat Rooms Table - Manage group chat rooms
 */
export const groupChatRooms = mysqlTable("groupChatRooms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 500 }),
  createdBy: int("createdBy").notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  maxMembers: int("maxMembers").default(1000).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GroupChatRoom = typeof groupChatRooms.$inferSelect;
export type InsertGroupChatRoom = typeof groupChatRooms.$inferInsert;

/**
 * Group Chat Members Table - Track members in group chats
 */
export const groupChatMembers = mysqlTable("groupChatMembers", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "moderator", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  lastReadAt: timestamp("lastReadAt").defaultNow().notNull(),
  isMuted: boolean("isMuted").default(false).notNull(),
});

export type GroupChatMember = typeof groupChatMembers.$inferSelect;
export type InsertGroupChatMember = typeof groupChatMembers.$inferInsert;

/**
 * Group Chat Messages Table - Store messages in group chats
 */
export const groupChatMessages = mysqlTable("groupChatMessages", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  senderId: int("senderId").notNull(),
  messageType: mysqlEnum("messageType", ["text", "image", "file", "emoji", "link", "system"]).default("text").notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  fileUrl: varchar("fileUrl", { length: 500 }),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"),
  emoji: varchar("emoji", { length: 50 }),
  linkUrl: varchar("linkUrl", { length: 500 }),
  linkTitle: varchar("linkTitle", { length: 255 }),
  linkDescription: text("linkDescription"),
  linkImage: varchar("linkImage", { length: 500 }),
  replyToId: int("replyToId"),
  isEdited: boolean("isEdited").default(false).notNull(),
  editedAt: timestamp("editedAt"),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GroupChatMessage = typeof groupChatMessages.$inferSelect;
export type InsertGroupChatMessage = typeof groupChatMessages.$inferInsert;

/**
 * User Status Table - Track user status and presence
 */
export const userStatus = mysqlTable("userStatus", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  status: mysqlEnum("status", ["online", "away", "busy", "offline"]).default("offline").notNull(),
  statusMessage: varchar("statusMessage", { length: 255 }),
  lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
  isTyping: boolean("isTyping").default(false).notNull(),
  typingRoomId: int("typingRoomId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserStatus = typeof userStatus.$inferSelect;
export type InsertUserStatus = typeof userStatus.$inferInsert;

/**
 * Message Reactions Table - Track emoji reactions on messages
 */
export const messageReactions = mysqlTable("messageReactions", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  userId: int("userId").notNull(),
  emoji: varchar("emoji", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MessageReaction = typeof messageReactions.$inferSelect;
export type InsertMessageReaction = typeof messageReactions.$inferInsert;

/**
 * Chat Mentions Table - Track mentions in messages
 */
export const chatMentions = mysqlTable("chatMentions", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  mentionedUserId: int("mentionedUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMention = typeof chatMentions.$inferSelect;
export type InsertChatMention = typeof chatMentions.$inferInsert;

// ==================== AI CHAT SYSTEM ====================

/**
 * AI Chat Training Data Table - Store admin responses for AI learning
 */
export const aiTrainingData = mysqlTable("aiTrainingData", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  userQuery: text("userQuery").notNull(),
  adminResponse: text("adminResponse").notNull(),
  category: varchar("category", { length: 100 }), // e.g., "products", "shipping", "payment", "general"
  dialect: varchar("dialect", { length: 50 }).default("egyptian"), // egyptian, levantine, gulf, etc.
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("0.00"), // 0-1 confidence score
  isApproved: boolean("isApproved").default(true).notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AITrainingData = typeof aiTrainingData.$inferSelect;
export type InsertAITrainingData = typeof aiTrainingData.$inferInsert;

/**
 * AI Responses Table - Store AI-generated responses for tracking and improvement
 */
export const aiResponses = mysqlTable("aiResponses", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  trainingDataId: int("trainingDataId"),
  response: text("response").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("0.00"),
  isHelpful: boolean("isHelpful"),
  userFeedback: text("userFeedback"),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIResponse = typeof aiResponses.$inferSelect;
export type InsertAIResponse = typeof aiResponses.$inferInsert;

/**
 * AI Conversation Context Table - Store conversation context for better responses
 */
export const aiConversationContext = mysqlTable("aiConversationContext", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  userId: int("userId").notNull(),
  topic: varchar("topic", { length: 255 }),
  context: text("context"), // JSON object with conversation context
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIConversationContext = typeof aiConversationContext.$inferSelect;
export type InsertAIConversationContext = typeof aiConversationContext.$inferInsert;

/**
 * AI Settings Table - Store AI configuration and learning parameters
 */
export const aiSettings = mysqlTable("aiSettings", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull().unique(),
  aiEnabled: boolean("aiEnabled").default(true).notNull(),
  aiName: varchar("aiName", { length: 100 }).default("روز الذكية"),
  aiPersonality: text("aiPersonality"), // JSON with personality traits
  responseStyle: varchar("responseStyle", { length: 50 }).default("friendly"), // friendly, professional, casual
  dialect: varchar("dialect", { length: 50 }).default("egyptian"),
  learningEnabled: boolean("learningEnabled").default(true).notNull(),
  autoRespondEnabled: boolean("autoRespondEnabled").default(false).notNull(),
  responseDelay: int("responseDelay").default(1000), // milliseconds
  maxResponseLength: int("maxResponseLength").default(500),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AISetting = typeof aiSettings.$inferSelect;
export type InsertAISetting = typeof aiSettings.$inferInsert;

// ==================== ADVANCED CHAT FEATURES ====================

/**
 * Message Search Index Table - For efficient full-text search
 */
export const messageSearchIndex = mysqlTable("messageSearchIndex", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull().unique(),
  roomId: int("roomId").notNull(),
  searchText: text("searchText").notNull(), // Full-text indexed content
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MessageSearchIndex = typeof messageSearchIndex.$inferSelect;
export type InsertMessageSearchIndex = typeof messageSearchIndex.$inferInsert;

/**
 * Message Pinned Table - Track pinned messages in rooms
 */
export const pinnedMessages = mysqlTable("pinnedMessages", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  roomId: int("roomId").notNull(),
  pinnedBy: int("pinnedBy").notNull(),
  pinnedAt: timestamp("pinnedAt").defaultNow().notNull(),
});

export type PinnedMessage = typeof pinnedMessages.$inferSelect;
export type InsertPinnedMessage = typeof pinnedMessages.$inferInsert;

/**
 * Message Read Status Table - Track message read status for users
 */
export const messageReadStatus = mysqlTable("messageReadStatus", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  userId: int("userId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
});

export type MessageReadStatus = typeof messageReadStatus.$inferSelect;
export type InsertMessageReadStatus = typeof messageReadStatus.$inferInsert;

/**
 * Group Chat Notifications Table - Track group chat notifications and mentions
 */
export const groupChatNotifications = mysqlTable("groupChatNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  messageId: int("messageId"),
  roomId: int("roomId").notNull(),
  type: mysqlEnum("type", ["mention", "reply", "reaction", "message"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GroupChatNotification = typeof groupChatNotifications.$inferSelect;
export type InsertGroupChatNotification = typeof groupChatNotifications.$inferInsert;

/**
 * Chat Filters Table - Store user's chat filter preferences
 */
export const chatFilters = mysqlTable("chatFilters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  muteNotifications: boolean("muteNotifications").default(false).notNull(),
  hideImages: boolean("hideImages").default(false).notNull(),
  hideLinks: boolean("hideLinks").default(false).notNull(),
  autoTranslate: boolean("autoTranslate").default(false).notNull(),
  targetLanguage: varchar("targetLanguage", { length: 10 }).default("ar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatFilter = typeof chatFilters.$inferSelect;
export type InsertChatFilter = typeof chatFilters.$inferInsert;

/**
 * Room Moderation Table - Track room moderation actions
 */
export const roomModerationActions = mysqlTable("roomModerationActions", {
  id: int("id").autoincrement().primaryKey(),
  roomId: int("roomId").notNull(),
  moderatorId: int("moderatorId").notNull(),
  targetUserId: int("targetUserId"),
  targetMessageId: int("targetMessageId"),
  action: mysqlEnum("action", ["mute", "unmute", "kick", "warn", "delete_message", "pin_message", "unpin_message"]).notNull(),
  reason: text("reason"),
  duration: int("duration"), // in minutes, null for permanent
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RoomModerationAction = typeof roomModerationActions.$inferSelect;
export type InsertRoomModerationAction = typeof roomModerationActions.$inferInsert;

// ==================== PRODUCT REVIEWS & RATINGS ====================

/**
 * Product Reviews Table - Customer reviews and ratings
 */
export const productReviews = mysqlTable("productReviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId"), // Reference to verified purchase
  rating: int("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false).notNull(),
  helpfulCount: int("helpfulCount").default(0).notNull(),
  unhelpfulCount: int("unhelpfulCount").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = typeof productReviews.$inferInsert;

/**
 * Review Images Table - Images attached to reviews
 */
export const reviewImages = mysqlTable("reviewImages", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: int("reviewId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReviewImage = typeof reviewImages.$inferSelect;
export type InsertReviewImage = typeof reviewImages.$inferInsert;

// ==================== DISCOUNT & COUPON SYSTEM ====================

/**
 * Discount Codes Table - Manage discount and promo codes
 */
export const discountCodes = mysqlTable("discountCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("minOrderAmount", { precision: 10, scale: 2 }).default("0"),
  maxDiscount: decimal("maxDiscount", { precision: 10, scale: 2 }), // Max discount amount
  usageLimit: int("usageLimit"), // Total usage limit
  usagePerUser: int("usagePerUser").default(1), // Usage limit per user
  usageCount: int("usageCount").default(0).notNull(),
  applicableCategories: text("applicableCategories"), // JSON array of category IDs
  applicableProducts: text("applicableProducts"), // JSON array of product IDs
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = typeof discountCodes.$inferInsert;

/**
 * Coupon Usage Table - Track coupon usage per user
 */
export const couponUsage = mysqlTable("couponUsage", {
  id: int("id").autoincrement().primaryKey(),
  couponId: int("couponId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId").notNull(),
  discountAmount: decimal("discountAmount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("usedAt").defaultNow().notNull(),
});

export type CouponUsage = typeof couponUsage.$inferSelect;
export type InsertCouponUsage = typeof couponUsage.$inferInsert;

// ==================== LOYALTY & REWARDS ====================

/**
 * Loyalty Points Table - Track user loyalty points
 */
export const loyaltyPoints = mysqlTable("loyaltyPoints", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalPoints: int("totalPoints").default(0).notNull(),
  usedPoints: int("usedPoints").default(0).notNull(),
  availablePoints: int("availablePoints").default(0).notNull(),
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum"]).default("bronze").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoyaltyPoint = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoint = typeof loyaltyPoints.$inferInsert;

/**
 * Points Transaction Table - Track loyalty points transactions
 */
export const pointsTransactions = mysqlTable("pointsTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderId: int("orderId"),
  transactionType: mysqlEnum("transactionType", ["earned", "redeemed", "expired", "adjusted"]).notNull(),
  points: int("points").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type InsertPointsTransaction = typeof pointsTransactions.$inferInsert;

// ==================== FAVORITES & WISHLIST ====================

/**
 * User Favorites Table - Track user favorite products
 */
export const userFavorites = mysqlTable("userFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  notes: text("notes"), // Optional notes about the product
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

// ==================== ANALYTICS & TRACKING ====================

/**
 * Product Views Table - Track product page views
 */
export const productViews = mysqlTable("productViews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 255 }),
  viewDuration: int("viewDuration"), // in seconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductView = typeof productViews.$inferSelect;
export type InsertProductView = typeof productViews.$inferInsert;

/**
 * User Activity Log Table - Track user activities
 */
export const userActivityLog = mysqlTable("userActivityLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  activityType: varchar("activityType", { length: 100 }).notNull(), // e.g., "login", "purchase", "review", "chat"
  description: text("description"),
  metadata: text("metadata"), // JSON object with additional info
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserActivityLog = typeof userActivityLog.$inferSelect;
export type InsertUserActivityLog = typeof userActivityLog.$inferInsert;

/**
 * Sales Analytics Table - Track daily sales metrics
 */
export const salesAnalytics = mysqlTable("salesAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  totalOrders: int("totalOrders").default(0).notNull(),
  totalRevenue: decimal("totalRevenue", { precision: 15, scale: 2 }).default("0").notNull(),
  totalItems: int("totalItems").default(0).notNull(),
  averageOrderValue: decimal("averageOrderValue", { precision: 10, scale: 2 }).default("0").notNull(),
  newCustomers: int("newCustomers").default(0).notNull(),
  returningCustomers: int("returningCustomers").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SalesAnalytic = typeof salesAnalytics.$inferSelect;
export type InsertSalesAnalytic = typeof salesAnalytics.$inferInsert;

// ==================== NOTIFICATIONS ====================

/**
 * Notifications Table - Store all user notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["order", "promotion", "review", "message", "system", "payment"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  actionUrl: varchar("actionUrl", { length: 500 }),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * SMS Logs Table - Track all SMS communications
 */
export const smsLogs = mysqlTable("smsLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // e.g., "order_confirmation", "shipment_update"
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SMSLog = typeof smsLogs.$inferSelect;
export type InsertSMSLog = typeof smsLogs.$inferInsert;


// ==================== WHATSAPP INTEGRATION ====================

/**
 * WhatsApp Groups Table - Store WhatsApp groups for product collection
 */
export const whatsappGroups = mysqlTable("whatsappGroups", {
  id: int("id").autoincrement().primaryKey(),
  groupName: varchar("groupName", { length: 255 }).notNull(),
  groupId: varchar("groupId", { length: 255 }).notNull().unique(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhatsappGroup = typeof whatsappGroups.$inferSelect;
export type InsertWhatsappGroup = typeof whatsappGroups.$inferInsert;

/**
 * WhatsApp Messages Table - Store messages from WhatsApp groups
 */
export const whatsappMessages = mysqlTable("whatsappMessages", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().references(() => whatsappGroups.id),
  messageId: varchar("messageId", { length: 255 }).notNull().unique(),
  senderName: varchar("senderName", { length: 255 }).notNull(),
  senderPhone: varchar("senderPhone", { length: 20 }).notNull(),
  messageText: text("messageText"),
  imageUrl: text("imageUrl"), // URL of product image
  mediaType: varchar("mediaType", { length: 50 }), // image, video, document
  isProcessed: boolean("isProcessed").default(false).notNull(),
  productId: int("productId"), // Link to created product
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

export type WhatsappMessage = typeof whatsappMessages.$inferSelect;
export type InsertWhatsappMessage = typeof whatsappMessages.$inferInsert;

/**
 * Product Extraction Log Table - Track product extraction from messages
 */
export const productExtractionLogs = mysqlTable("productExtractionLogs", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull().references(() => whatsappMessages.id),
  extractedText: text("extractedText"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0.00 to 1.00
  suggestedCategory: varchar("suggestedCategory", { length: 255 }),
  suggestedPrice: decimal("suggestedPrice", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "manual_review"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy"), // Admin user ID
  reviewNotes: text("reviewNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export type ProductExtractionLog = typeof productExtractionLogs.$inferSelect;
export type InsertProductExtractionLog = typeof productExtractionLogs.$inferInsert;

/**
 * WhatsApp Sync Configuration Table - Store sync settings and API credentials
 */
export const whatsappSyncConfig = mysqlTable("whatsappSyncConfig", {
  id: int("id").autoincrement().primaryKey(),
  businessPhoneNumber: varchar("businessPhoneNumber", { length: 20 }).notNull(),
  accessToken: varchar("accessToken", { length: 500 }).notNull(), // Encrypted
  webhookUrl: text("webhookUrl"),
  webhookVerifyToken: varchar("webhookVerifyToken", { length: 255 }),
  isEnabled: boolean("isEnabled").default(true).notNull(),
  autoPublishProducts: boolean("autoPublishProducts").default(false).notNull(),
  requireManualApproval: boolean("requireManualApproval").default(true).notNull(),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhatsappSyncConfig = typeof whatsappSyncConfig.$inferSelect;
export type InsertWhatsappSyncConfig = typeof whatsappSyncConfig.$inferInsert;

/**
 * WhatsApp Product Mapping Table - Map extracted products to categories
 */
export const whatsappProductMappings = mysqlTable("whatsappProductMappings", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull().references(() => whatsappMessages.id),
  productId: int("productId").notNull().references(() => products.id),
  categoryId: int("categoryId").notNull().references(() => categories.id),
  mappingConfidence: decimal("mappingConfidence", { precision: 3, scale: 2 }),
  isManualMapping: boolean("isManualMapping").default(false).notNull(),
  mappedBy: int("mappedBy"), // User ID who did the mapping
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WhatsappProductMapping = typeof whatsappProductMappings.$inferSelect;
export type InsertWhatsappProductMapping = typeof whatsappProductMappings.$inferInsert;


// ==================== ADVANCED SEARCH & RECOMMENDATIONS ====================

/**
 * Search History Table - Track user search queries
 */
export const searchHistory = mysqlTable("searchHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  query: varchar("query", { length: 255 }).notNull(),
  resultsCount: int("resultsCount").default(0).notNull(),
  categoryId: int("categoryId"),
  minPrice: decimal("minPrice", { precision: 10, scale: 2 }),
  maxPrice: decimal("maxPrice", { precision: 10, scale: 2 }),
  minRating: int("minRating"),
  sortBy: varchar("sortBy", { length: 50 }), // "newest", "popular", "price_asc", "price_desc", "rating"
  sessionId: varchar("sessionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = typeof searchHistory.$inferInsert;

/**
 * Search Preferences Table - Save user search preferences
 */
export const searchPreferences = mysqlTable("searchPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  savedFilters: text("savedFilters"), // JSON array of saved filter sets
  defaultSortBy: varchar("defaultSortBy", { length: 50 }).default("newest"),
  defaultCategoryId: int("defaultCategoryId"),
  preferredPriceRange: text("preferredPriceRange"), // JSON {min, max}
  preferredRating: int("preferredRating"),
  enableAutoSuggestions: boolean("enableAutoSuggestions").default(true).notNull(),
  enableSearchHistory: boolean("enableSearchHistory").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SearchPreference = typeof searchPreferences.$inferSelect;
export type InsertSearchPreference = typeof searchPreferences.$inferInsert;

/**
 * Product Recommendations Table - Store AI-generated recommendations
 */
export const productRecommendations = mysqlTable("productRecommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  productId: int("productId").notNull(),
  recommendationType: mysqlEnum("recommendationType", ["viewed", "purchased", "similar", "trending", "personalized", "category_based"]).notNull(),
  reason: varchar("reason", { length: 255 }), // e.g., "Based on your recent views"
  score: decimal("score", { precision: 3, scale: 2 }).default("0.5"), // 0-1 confidence score
  isClicked: boolean("isClicked").default(false).notNull(),
  isConverted: boolean("isConverted").default(false).notNull(),
  clickedAt: timestamp("clickedAt"),
  convertedAt: timestamp("convertedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductRecommendation = typeof productRecommendations.$inferSelect;
export type InsertProductRecommendation = typeof productRecommendations.$inferInsert;

/**
 * User Behavior Table - Track user interactions for ML/recommendations
 */
export const userBehavior = mysqlTable("userBehavior", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  behaviorType: mysqlEnum("behaviorType", ["view", "click", "add_to_cart", "purchase", "favorite", "review", "search", "filter"]).notNull(),
  productId: int("productId"),
  categoryId: int("categoryId"),
  metadata: text("metadata"), // JSON with additional context
  sessionId: varchar("sessionId", { length: 255 }),
  duration: int("duration"), // in seconds
  ipAddress: varchar("ipAddress", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserBehavior = typeof userBehavior.$inferSelect;
export type InsertUserBehavior = typeof userBehavior.$inferInsert;

/**
 * Similar Products Table - Store pre-computed similar products for performance
 */
export const similarProducts = mysqlTable("similarProducts", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  similarProductId: int("similarProductId").notNull(),
  similarityScore: decimal("similarityScore", { precision: 3, scale: 2 }).notNull(), // 0-1
  reason: varchar("reason", { length: 255 }), // "same_category", "similar_price", "similar_rating"
  computedAt: timestamp("computedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SimilarProduct = typeof similarProducts.$inferSelect;
export type InsertSimilarProduct = typeof similarProducts.$inferInsert;

/**
 * Trending Products Table - Track trending products over time
 */
export const trendingProducts = mysqlTable("trendingProducts", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  period: mysqlEnum("period", ["daily", "weekly", "monthly"]).notNull(),
  rank: int("rank").notNull(),
  views: int("views").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  purchases: int("purchases").default(0).notNull(),
  trendScore: decimal("trendScore", { precision: 5, scale: 2 }).default("0"), // Composite score
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrendingProduct = typeof trendingProducts.$inferSelect;
export type InsertTrendingProduct = typeof trendingProducts.$inferInsert;

/**
 * Search Suggestions Table - Pre-computed search suggestions
 */
export const searchSuggestions = mysqlTable("searchSuggestions", {
  id: int("id").autoincrement().primaryKey(),
  query: varchar("query", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }),
  frequency: int("frequency").default(1).notNull(),
  isPopular: boolean("isPopular").default(false).notNull(),
  lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SearchSuggestion = typeof searchSuggestions.$inferSelect;
export type InsertSearchSuggestion = typeof searchSuggestions.$inferInsert;


/**
 * Review Analysis Table - AI-powered review analysis
 */
export const reviewAnalysis = mysqlTable("reviewAnalysis", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: int("reviewId").notNull(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]).notNull(),
  sentimentScore: decimal("sentimentScore", { precision: 3, scale: 2 }), // -1 to 1
  keywordExtraction: text("keywordExtraction"), // JSON array of keywords
  summary: text("summary"), // AI-generated summary
  isHelpful: boolean("isHelpful").default(true).notNull(),
  helpfulCount: int("helpfulCount").default(0).notNull(),
  unhelpfulCount: int("unhelpfulCount").default(0).notNull(),
  analyzedAt: timestamp("analyzedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ReviewAnalysis = typeof reviewAnalysis.$inferSelect;
export type InsertReviewAnalysis = typeof reviewAnalysis.$inferInsert;

/**
 * Advanced Notifications Table - Real-time notifications
 */
export const advancedNotifications = mysqlTable("advancedNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "order_new",
    "order_updated",
    "recommendation",
    "product_available",
    "price_drop",
    "review_response",
    "promotion",
    "system",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  metadata: text("metadata"), // JSON object with additional data
  isRead: boolean("isRead").default(false).notNull(),
  isPriority: boolean("isPriority").default(false).notNull(),
  actionUrl: varchar("actionUrl", { length: 500 }),
  soundEnabled: boolean("soundEnabled").default(true).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AdvancedNotification = typeof advancedNotifications.$inferSelect;
export type InsertAdvancedNotification = typeof advancedNotifications.$inferInsert;

/**
 * Sales Report Table - Daily/Weekly/Monthly sales data
 */
export const salesReports = mysqlTable("salesReports", {
  id: int("id").autoincrement().primaryKey(),
  period: mysqlEnum("period", ["daily", "weekly", "monthly"]).notNull(),
  date: timestamp("date").notNull(),
  totalOrders: int("totalOrders").default(0).notNull(),
  totalRevenue: decimal("totalRevenue", { precision: 12, scale: 2 }).default("0").notNull(),
  totalItems: int("totalItems").default(0).notNull(),
  averageOrderValue: decimal("averageOrderValue", { precision: 10, scale: 2 }).default("0"),
  topProductId: int("topProductId"),
  topCategoryId: int("topCategoryId"),
  newCustomers: int("newCustomers").default(0).notNull(),
  returningCustomers: int("returningCustomers").default(0).notNull(),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }), // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SalesReport = typeof salesReports.$inferSelect;
export type InsertSalesReport = typeof salesReports.$inferInsert;

/**
 * User Behavior Report Table - Track user behavior patterns
 */
export const userBehaviorReports = mysqlTable("userBehaviorReports", {
  id: int("id").autoincrement().primaryKey(),
  period: mysqlEnum("period", ["daily", "weekly", "monthly"]).notNull(),
  date: timestamp("date").notNull(),
  totalActiveUsers: int("totalActiveUsers").default(0).notNull(),
  totalPageViews: int("totalPageViews").default(0).notNull(),
  totalSessions: int("totalSessions").default(0).notNull(),
  averageSessionDuration: int("averageSessionDuration").default(0), // in seconds
  bounceRate: decimal("bounceRate", { precision: 5, scale: 2 }), // percentage
  topPageUrl: varchar("topPageUrl", { length: 500 }),
  topSearchQuery: varchar("topSearchQuery", { length: 255 }),
  deviceType: varchar("deviceType", { length: 50 }), // "mobile", "desktop", "tablet"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type UserBehaviorReport = typeof userBehaviorReports.$inferSelect;
export type InsertUserBehaviorReport = typeof userBehaviorReports.$inferInsert;

/**
 * Product Performance Report Table - Track product performance
 */
export const productPerformanceReports = mysqlTable("productPerformanceReports", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  period: mysqlEnum("period", ["daily", "weekly", "monthly"]).notNull(),
  date: timestamp("date").notNull(),
  views: int("views").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  purchases: int("purchases").default(0).notNull(),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0").notNull(),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }),
  reviewCount: int("reviewCount").default(0).notNull(),
  returnRate: decimal("returnRate", { precision: 5, scale: 2 }), // percentage
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }), // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ProductPerformanceReport = typeof productPerformanceReports.$inferSelect;
export type InsertProductPerformanceReport = typeof productPerformanceReports.$inferInsert;

/**
 * Advanced Search Features Table - Track advanced search usage
 */
export const advancedSearchFeatures = mysqlTable("advancedSearchFeatures", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  searchQuery: varchar("searchQuery", { length: 255 }).notNull(),
  searchType: mysqlEnum("searchType", ["text", "fuzzy", "image", "voice", "filter"]).notNull(),
  resultsCount: int("resultsCount").default(0).notNull(),
  clickedProductId: int("clickedProductId"),
  searchDuration: int("searchDuration"), // in milliseconds
  filters: text("filters"), // JSON object of applied filters
  sortBy: varchar("sortBy", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AdvancedSearchFeature = typeof advancedSearchFeatures.$inferSelect;
export type InsertAdvancedSearchFeature = typeof advancedSearchFeatures.$inferInsert;


// ==================== PAYMENT & BILLING ====================

/**
 * Stripe Payments Table - Store Stripe payment information
 */
export const stripePayments = mysqlTable("stripePayments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: int("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique().notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("SAR").notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "canceled", "refunded"]).notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }), // card, bank_transfer, etc.
  cardBrand: varchar("cardBrand", { length: 50 }), // visa, mastercard, etc.
  cardLast4: varchar("cardLast4", { length: 4 }),
  receiptUrl: varchar("receiptUrl", { length: 500 }),
  errorMessage: text("errorMessage"),
  metadata: text("metadata"), // JSON object with additional data
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type StripePayment = typeof stripePayments.$inferSelect;
export type InsertStripePayment = typeof stripePayments.$inferInsert;

/**
 * Invoices Table - Store invoice information
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: int("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).unique().notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["draft", "sent", "viewed", "paid", "overdue", "canceled"]).default("draft").notNull(),
  dueDate: timestamp("dueDate"),
  paidDate: timestamp("paidDate"),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// ==================== LOYALTY & REWARDS ====================

/**
 * Loyalty Points Table - Track user loyalty points
 */

/**
 * Display Management Table - لوحة إدارة شاشات العرض
 * Track display configurations, settings, and preferences
 */
export const displayManagement = mysqlTable("displayManagement", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  displayType: mysqlEnum("displayType", ["banner", "carousel", "grid", "featured", "promotion", "custom"]).notNull(),
  location: varchar("location", { length: 100 }).notNull(), // e.g., "homepage_top", "homepage_middle", "sidebar"
  isActive: boolean("isActive").default(true).notNull(),
  priority: int("priority").default(0).notNull(), // Higher priority displays first
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  backgroundColor: varchar("backgroundColor", { length: 50 }),
  textColor: varchar("textColor", { length: 50 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  content: text("content"), // JSON content for the display
  targetAudience: varchar("targetAudience", { length: 100 }), // e.g., "all", "new_users", "vip"
  analyticsData: text("analyticsData"), // JSON analytics data
  createdBy: int("createdBy").notNull().references(() => users.id, { onDelete: "set null" }),
  updatedBy: int("updatedBy").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DisplayManagement = typeof displayManagement.$inferSelect;
export type InsertDisplayManagement = typeof displayManagement.$inferInsert;

/**
 * Display Analytics Table - Track display performance
 */
export const displayAnalytics = mysqlTable("displayAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  displayId: int("displayId").notNull().references(() => displayManagement.id, { onDelete: "cascade" }),
  views: int("views").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  conversions: int("conversions").default(0).notNull(),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DisplayAnalytics = typeof displayAnalytics.$inferSelect;
export type InsertDisplayAnalytics = typeof displayAnalytics.$inferInsert;
