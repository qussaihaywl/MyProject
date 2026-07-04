import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb, loginUser, registerUser, hashPassword } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Authentication - Login", () => {
  const testEmail = "test-login@example.com";
  const testPassword = "TestPassword123!";
  const testName = "Test User";

  beforeAll(async () => {
    // Clean up any existing test user
    const db = await getDb();
    if (db) {
      await db.delete(users).where(eq(users.email, testEmail));
    }
  });

  afterAll(async () => {
    // Clean up test user
    const db = await getDb();
    if (db) {
      await db.delete(users).where(eq(users.email, testEmail));
    }
  });

  it("should register a new user", async () => {
    const result = await registerUser({
      name: testName,
      email: testEmail,
      password: testPassword,
    });

    expect(result).toBeDefined();
    expect(result.email).toBe(testEmail);
    expect(result.name).toBe(testName);
    expect(result.id).toBeGreaterThan(0);
  });

  it("should login with correct credentials", async () => {
    const result = await loginUser(testEmail, testPassword);

    expect(result).toBeDefined();
    expect(result.email).toBe(testEmail);
    expect(result.name).toBe(testName);
    expect(result.id).toBeGreaterThan(0);
  });

  it("should fail login with wrong password", async () => {
    try {
      await loginUser(testEmail, "WrongPassword123!");
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid email or password");
    }
  });

  it("should fail login with non-existent email", async () => {
    try {
      await loginUser("nonexistent@example.com", testPassword);
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid email or password");
    }
  });
});
