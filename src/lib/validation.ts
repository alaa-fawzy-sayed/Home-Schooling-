/**
 * Nova Learn - Validation Utilities
 * Shared validation functions for forms
 */

/**
 * Common email domains for typo detection
 */
const COMMON_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'live.com', 'msn.com', 'aol.com',
  'mail.com', 'protonmail.com', 'zoho.com',
  // Egyptian domains
  'nova.edu', 'edu.eg', 'gov.eg',
];

/**
 * Calculate Levenshtein distance between two strings
 * Used to detect typos in email domains
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Suggest correct email domain if typo detected
 */
function suggestEmailDomain(domain: string): string | null {
  const lowerDomain = domain.toLowerCase();
  
  // Check for exact match first
  if (COMMON_EMAIL_DOMAINS.includes(lowerDomain)) {
    return null; // No suggestion needed
  }

  // Find closest match
  let closestMatch: string | null = null;
  let minDistance = Infinity;

  for (const commonDomain of COMMON_EMAIL_DOMAINS) {
    const distance = levenshteinDistance(lowerDomain, commonDomain);
    
    // Only suggest if distance is 1 or 2 (likely typo)
    if (distance > 0 && distance <= 2 && distance < minDistance) {
      minDistance = distance;
      closestMatch = commonDomain;
    }
  }

  return closestMatch;
}

/**
 * Validate email format with strict rules and typo detection
 * - Must have exactly one @ symbol
 * - No consecutive dots or @ symbols
 * - Valid format: local-part@domain.tld
 * - Returns validation result with suggestion if typo detected
 */
export function validateEmail(email: string): {
  valid: boolean;
  suggestion?: string;
  error?: string;
} {
  if (!email) {
    return { valid: false, error: "البريد الإلكتروني مطلوب" };
  }
  
  // Check for exactly one @ symbol
  if ((email.match(/@/g) || []).length !== 1) {
    return { valid: false, error: "البريد الإلكتروني يجب أن يحتوي على @ واحدة فقط" };
  }
  
  // Check for consecutive dots or @ symbols
  if (/\.{2,}|@{2,}/.test(email)) {
    return { valid: false, error: "البريد الإلكتروني يحتوي على رموز متتالية غير صحيحة" };
  }
  
  // Standard email regex validation
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "صيغة البريد الإلكتروني غير صحيحة" };
  }

  // Extract domain and check for typos
  const domain = email.split('@')[1];
  const suggestion = suggestEmailDomain(domain);

  if (suggestion) {
    const suggestedEmail = email.split('@')[0] + '@' + suggestion;
    return { 
      valid: false, 
      error: `هل تقصد ${suggestedEmail}؟`,
      suggestion: suggestedEmail 
    };
  }

  return { valid: true };
}

/**
 * Simple email validation (without typo detection)
 * Use this for login forms where we don't want to suggest corrections
 */
export function validateEmailSimple(email: string): boolean {
  if (!email) return false;
  
  // Check for exactly one @ symbol
  if ((email.match(/@/g) || []).length !== 1) return false;
  
  // Check for consecutive dots or @ symbols
  if (/\.{2,}|@{2,}/.test(email)) return false;
  
  // Standard email regex validation
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * - Minimum 8 characters
 * - At least one letter and one number (optional strict mode)
 */
export function validatePassword(password: string, strict = false): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!password) {
    errors.push("كلمة المرور مطلوبة");
    return { valid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
  }
  
  if (strict) {
    if (!/[a-zA-Z]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على حرف واحد على الأقل");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate phone number (Egyptian format)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  
  // Egyptian phone: +20 followed by 10 digits, or 01 followed by 9 digits
  const phoneRegex = /^(\+20|0)?1[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate Arabic name
 */
export function validateArabicName(name: string): boolean {
  if (!name) return false;
  
  // Must contain at least some Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(name) && name.trim().length >= 2;
}

/**
 * Validate English name
 */
export function validateEnglishName(name: string): boolean {
  if (!name) return false;
  
  // Must contain only English letters and spaces
  const englishRegex = /^[a-zA-Z\s]+$/;
  return englishRegex.test(name) && name.trim().length >= 2;
}
