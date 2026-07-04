import mysql from "mysql2/promise";
import { InsertUser, users, categories, products, cartItems, orders, orderItems, inquiries, chatRooms, messages, InsertMessage, warehouses, InsertWarehouse, advancedOrders, InsertAdvancedOrder, warehouseCommissions, InsertWarehouseCommission, delegateCommissions, InsertDelegateCommission, facebookPages, productShares, showcaseVideos, InsertShowcaseVideo, shipments, orderStatusHistory, customerAddresses, userFavorites, productReviews, InsertProductReview, reviewImages, InsertReviewImage, discountCodes, InsertDiscountCode, couponUsage, InsertCouponUsage, loyaltyPoints, InsertLoyaltyPoint, pointsTransactions, InsertPointsTransaction, notifications, InsertNotification, smsLogs, InsertSMSLog, userActivityLog, InsertUserActivityLog, salesAnalytics, InsertSalesAnalytic, displayManagement, InsertDisplayManagement } from "../drizzle/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { ENV } from './_core/env';
import bcrypt from 'bcryptjs';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';

let _db: MySql2Database | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = await mysql.createPool({
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      _db = drizzle(pool);
      console.log("[Database] Connected successfully");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Register new user
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  walletNumber?: string;
  walletType?: string;
}): Promise<{ id: number; email: string; name: string; openId: string }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const hashedPassword = await hashPassword(userData.password);
  const tempOpenId = `local-temp-${Date.now()}`;

  const result = await db.insert(users).values({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    phone: userData.phone,
    address: userData.address,
    city: userData.city,
    zipCode: userData.zipCode,
    walletNumber: userData.walletNumber,
    walletType: userData.walletType,
    openId: tempOpenId,
    loginMethod: "local",
    role: "user",
    isActive: true,
  });

  const userId = result[0].insertId as number;
  const finalOpenId = `local-${userId}`;

  await db.update(users).set({ openId: finalOpenId }).where(eq(users.id, userId));

  return {
    id: userId,
    email: userData.email,
    name: userData.name,
    openId: finalOpenId,
  };
}

// Login user
export async function loginUser(email: string, password: string): Promise<any> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user || user.length === 0) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  const isPasswordValid = await verifyPassword(password, user[0].password || "");

  if (!isPasswordValid) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  const { password: _pw, ...safeUser } = user[0];
  return safeUser;
}

// Get user by email
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

// Get all users
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users);
}

// Get user by ID
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

// Create user
export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values(data);
  return result;
}

// Update user
export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set(data).where(eq(users.id, id));
}

// Delete user
export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(users).where(eq(users.id, id));
}

// Get all products
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products);
}

// Get products
export async function getProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products);
}

// Get product by ID
export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0] || null;
}

// Create product
export async function createProduct(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

// Update product
export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
}

// Delete product
export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

// Get all categories
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories);
}

// Get categories
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories);
}

// Get categories for homepage
export async function getCategoriesForHomepage() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).limit(10);
}

// Get category by ID
export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0] || null;
}

// Create category
export async function createCategory(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(data);
  return result;
}

// Update category
export async function updateCategory(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
}

// Delete category
export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// Reorder categories
export async function reorderCategories(categoryIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (let i = 0; i < categoryIds.length; i++) {
    await db.update(categories).set({ displayOrder: i }).where(eq(categories.id, categoryIds[i]));
  }
}

// Get all warehouses
export async function getAllWarehouses() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(warehouses);
}

// Get warehouses
export async function getWarehouses() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(warehouses);
}

// Get warehouse by ID
export async function getWarehouseById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(warehouses).where(eq(warehouses.id, id)).limit(1);
  return result[0] || null;
}

// Create warehouse
export async function createWarehouse(data: InsertWarehouse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(warehouses).values(data);
  return result;
}

// Update warehouse
export async function updateWarehouse(id: number, data: Partial<InsertWarehouse>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(warehouses).set(data).where(eq(warehouses.id, id));
}

// Delete warehouse
export async function deleteWarehouse(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(warehouses).where(eq(warehouses.id, id));
}

// Get all orders
export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders);
}

// Get order by ID
export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0] || null;
}

// Create order
export async function createOrder(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  return result;
}

// Update order
export async function updateOrder(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set(data).where(eq(orders.id, id));
}

// Delete order
export async function deleteOrder(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(orders).where(eq(orders.id, id));
}

// Get orders by user
export async function getOrders(userId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (userId) {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
  return await db.select().from(orders);
}

// Cart functions
export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cartItems).values({ userId, productId, quantity });
  return result;
}

export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function updateCartQuantity(cartItemId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, cartItemId));
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

// Favorites functions
export async function addToFavorites(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userFavorites).values({ userId, productId });
  return result;
}

export async function removeFromFavorites(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(userFavorites).where(and(eq(userFavorites.userId, userId), eq(userFavorites.productId, productId)));
}

export async function getFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
}

export async function isFavorite(userId: number, productId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(userFavorites).where(and(eq(userFavorites.userId, userId), eq(userFavorites.productId, productId))).limit(1);
  return result.length > 0;
}

// Chat functions
export async function getChatRooms(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(chatRooms).limit(50);
}

export async function getMessages(chatRoomId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).limit(100);
}

export async function addMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(messages).values(data);
  return result;
}

// Product reviews
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productReviews).where(eq(productReviews.productId, productId));
}

export async function createProductReview(data: InsertProductReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productReviews).values(data);
  return result;
}

export async function addReviewImages(data: InsertReviewImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reviewImages).values(data);
  return result;
}

// Showcase videos
export async function getShowcaseVideos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(showcaseVideos);
}

export async function getShowcaseVideoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(showcaseVideos).where(eq(showcaseVideos.id, id)).limit(1);
  return result[0] || null;
}

export async function createShowcaseVideo(data: InsertShowcaseVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(showcaseVideos).values(data);
  return result;
}

export async function updateShowcaseVideo(id: number, data: Partial<InsertShowcaseVideo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(showcaseVideos).set(data).where(eq(showcaseVideos.id, id));
}

export async function deleteShowcaseVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(showcaseVideos).where(eq(showcaseVideos.id, id));
}

export async function reorderShowcaseVideos(videoIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (let i = 0; i < videoIds.length; i++) {
    await db.update(showcaseVideos).set({ displayOrder: i }).where(eq(showcaseVideos.id, videoIds[i]));
  }
}

// Advanced orders
export async function getAdvancedOrders() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(advancedOrders);
}

export async function getAdvancedOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(advancedOrders).where(eq(advancedOrders.id, id)).limit(1);
  return result[0] || null;
}

export async function createAdvancedOrder(data: InsertAdvancedOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(advancedOrders).values(data);
  return result;
}

export async function updateAdvancedOrder(id: number, data: Partial<InsertAdvancedOrder>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(advancedOrders).set(data).where(eq(advancedOrders.id, id));
}

export async function deleteAdvancedOrder(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(advancedOrders).where(eq(advancedOrders.id, id));
}

// Discount codes
export async function getDiscountCodeByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(discountCodes).where(eq(discountCodes.code, code)).limit(1);
  return result[0] || null;
}

export async function validateDiscountCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const discountCode = await db.select().from(discountCodes).where(eq(discountCodes.code, code)).limit(1);
  return discountCode[0] || null;
}

// Loyalty points
export async function initializeLoyaltyPoints(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(loyaltyPoints).values({ userId, totalPoints: 0, usedPoints: 0, availablePoints: 0, tier: 'bronze' });
  const result = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);
  return result[0] || null;
}

export async function getUserLoyaltyPoints(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);
  return result[0] || null;
}

export async function addLoyaltyPoints(userId: number, points: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const userPoints = await getUserLoyaltyPoints(userId);
  if (userPoints) {
    await db.update(loyaltyPoints).set({ totalPoints: userPoints.totalPoints + points }).where(eq(loyaltyPoints.userId, userId));
  } else {
    await initializeLoyaltyPoints(userId);
    await db.update(loyaltyPoints).set({ totalPoints: points }).where(eq(loyaltyPoints.userId, userId));
  }
}

export async function redeemLoyaltyPoints(userId: number, points: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const userPoints = await getUserLoyaltyPoints(userId);
  if (userPoints && userPoints.totalPoints >= points) {
    await db.update(loyaltyPoints).set({ totalPoints: userPoints.totalPoints - points }).where(eq(loyaltyPoints.userId, userId));
    return true;
  }
  return false;
}

// Notifications
export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result.length;
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}

// User activity
export async function logUserActivity(data: InsertUserActivityLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userActivityLog).values(data);
  return result;
}

export async function logProductView(userId: number, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userActivityLog).values({
    userId,
    activityType: 'product_view',
    description: `Viewed product ${productId}`,
    metadata: JSON.stringify({ productId }),
  });
  return result;
}

// Display management
export async function getDisplayManagement() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(displayManagement).limit(1);
  return result[0] || null;
}

export async function getDisplayManagementById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(displayManagement).where(eq(displayManagement.id, id)).limit(1);
  return result[0] || null;
}

// AI Settings and Training Data (placeholder functions)
export async function getAISettings() {
  return { model: 'gpt-4', temperature: 0.7 };
}

export async function upsertAISettings(settings: any) {
  return settings;
}

export async function saveAITrainingData(data: any) {
  return data;
}

export async function getAITrainingData() {
  return [];
}

export async function findSimilarTrainingData(query: string) {
  return [];
}

export async function markAIResponseFeedback(responseId: string, feedback: string) {
  return { success: true };
}


// Facebook functions
export async function getFacebookPages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(facebookPages);
}

export async function createFacebookPage(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(facebookPages).values(data);
  return result;
}

export async function shareProductToFacebook(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(productShares).values(data);
  return result;
}

export async function getProductShares(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productShares).where(eq(productShares.productId, productId));
}


// Create admin user if not exists
export async function createAdminUser() {
  const db = await getDb();
  if (!db) return;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

  if (existingAdmin.length === 0) {
    const hashedPassword = await hashPassword(adminPassword);
    await db.insert(users).values({
      name: "مسؤول النظام",
      email: adminEmail,
      password: hashedPassword,
      openId: `admin-${Date.now()}`,
      loginMethod: "local",
      role: "admin",
      isActive: true,
    });
  }
}

// Upsert user - update if exists, create if not
export async function upsertUser(userData: {
  openId: string;
  name: string;
  email: string;
  password: string;
  lastSignedIn?: Date;
}): Promise<any> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if user exists by openId
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.openId, userData.openId))
    .limit(1);

  if (existingUser.length > 0) {
    // Update existing user
    await db
      .update(users)
      .set({
        lastSignedIn: userData.lastSignedIn || new Date(),
        name: userData.name,
        email: userData.email,
      })
      .where(eq(users.openId, userData.openId));

    return existingUser[0];
  } else {
    // Create new user
    const result = await db.insert(users).values({
      openId: userData.openId,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      loginMethod: "oauth",
      role: "user",
      isActive: true,
      lastSignedIn: userData.lastSignedIn || new Date(),
    });

    // Return the created user
    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, userData.openId))
      .limit(1);

    return newUser[0];
  }
}


// Get user by openId
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0] || null;
}


// Delegate Commission functions
export async function deleteDelegateCommission(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(delegateCommissions).where(eq(delegateCommissions.id, id));
}

export async function getDelegateCommissionStats(delegateId?: string) {
  const db = await getDb();
  if (!db) return null;
  if (delegateId) {
    const result = await db.select().from(delegateCommissions).where(eq(delegateCommissions.delegateId, parseInt(delegateId)));
    return result;
  }
  return await db.select().from(delegateCommissions);
}

export async function getAllDelegatesStats() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(delegateCommissions);
}


export async function getDelegateCommissions(filters?: { delegateName?: string; status?: string }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(delegateCommissions) as any;
  if (filters?.status) {
    query = query.where(eq(delegateCommissions.status, filters.status as any));
  }
  return await query;
}

export async function getDelegateCommissionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(delegateCommissions).where(eq(delegateCommissions.id, id)).limit(1);
  return result[0] || null;
}

export async function updateDelegateCommission(id: number, data: Partial<InsertDelegateCommission>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(delegateCommissions).set(data).where(eq(delegateCommissions.id, id));
  return await getDelegateCommissionById(id);
}


// Warehouse Commission functions
export async function getWarehouseCommissionStats(warehouseId?: string) {
  const db = await getDb();
  if (!db) return null;
  if (warehouseId) {
    const result = await db.select().from(warehouseCommissions).where(eq(warehouseCommissions.warehouseId, parseInt(warehouseId)));
    return result;
  }
  return await db.select().from(warehouseCommissions);
}

export async function getAllWarehousesStats() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(warehouseCommissions);
}

export async function getWarehouseCommissions(filters?: { warehouseId?: string; status?: string }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(warehouseCommissions) as any;
  if (filters?.status) {
    query = query.where(eq(warehouseCommissions.status, filters.status as any));
  }
  return await query;
}

export async function getWarehouseCommissionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(warehouseCommissions).where(eq(warehouseCommissions.id, id)).limit(1);
  return result[0] || null;
}

export async function createWarehouseCommission(data: InsertWarehouseCommission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(warehouseCommissions).values(data);
  return await getWarehouseCommissionById(result[0].insertId as number);
}

export async function updateWarehouseCommission(id: number, data: Partial<InsertWarehouseCommission>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(warehouseCommissions).set(data).where(eq(warehouseCommissions.id, id));
  return await getWarehouseCommissionById(id);
}

export async function deleteWarehouseCommission(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(warehouseCommissions).where(eq(warehouseCommissions.id, id));
}

export async function createDelegateCommission(data: InsertDelegateCommission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(delegateCommissions).values(data);
  return await getDelegateCommissionById(result[0].insertId as number);
}
