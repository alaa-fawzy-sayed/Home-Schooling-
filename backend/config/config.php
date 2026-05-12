<?php
/**
 * Nova Learn - Application Configuration
 */

define('APP_NAME', 'Nova Learn');
define('APP_VERSION', '1.0.0');
define('APP_ENV', getenv('APP_ENV') ?: 'development');
define('APP_DEBUG', APP_ENV === 'development');

// JWT Secret Key
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'nova-learn-secret-key-change-in-production-2026');
define('JWT_EXPIRY', 86400 * 7); // 7 days

// Upload settings
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 500 * 1024 * 1024); // 500MB for videos
define('ALLOWED_VIDEO_TYPES', ['mp4', 'webm', 'mkv']);
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'webp', 'gif']);

// Pagination
define('DEFAULT_PER_PAGE', 20);
define('MAX_PER_PAGE', 100);

// CORS
define('CORS_ORIGINS', ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000']);

// Password settings
define('PASSWORD_MIN_LENGTH', 8);
define('BCRYPT_COST', 12);

// Rate limiting
define('RATE_LIMIT_REQUESTS', 100);
define('RATE_LIMIT_WINDOW', 60); // seconds

// Timezone
date_default_timezone_set('Africa/Cairo');

// Error reporting
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}
