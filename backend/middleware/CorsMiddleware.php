<?php
/**
 * Nova Learn - CORS Middleware
 */

namespace Middleware;

use Core\Request;

class CorsMiddleware
{
    public static function handle(Request $request): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, CORS_ORIGINS) || APP_DEBUG) {
            header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
        }
        
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");
    }
}
