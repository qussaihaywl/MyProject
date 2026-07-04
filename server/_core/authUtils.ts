import bcrypt from "bcryptjs";

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password with its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number format (Jordan)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Accept various Jordanian phone formats
  const phoneRegex = /^(\+962|0)?7[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Generate a random token for email verification or password reset
 */
export function generateToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .substring(0, 255);
}

/**
 * Check if email already exists in database
 */
export async function isEmailUnique(email: string, db: any): Promise<boolean> {
  const existingUser = await db.getUserByEmail(email);
  return !existingUser;
}
