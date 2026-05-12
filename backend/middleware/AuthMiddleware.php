<?php
/**
 * Nova Learn - Auth Middleware
 */

namespace Middleware;

use Core\{Request, Auth, Response};

class AuthMiddleware
{
    /**
     * Require authenticated user
     */
    public static function requireAuth(Request $request): void
    {
        $user = Auth::user($request);
        if (!$user) {
            Response::unauthorized('Authentication required. Please login.');
        }
    }

    /**
     * Require admin role
     */
    public static function requireAdmin(Request $request): void
    {
        $user = Auth::user($request);
        if (!$user) {
            Response::unauthorized('Authentication required');
        }
        if (!in_array($user['role'] ?? '', ['super_admin', 'admin'])) {
            Response::forbidden('Admin access required');
        }
    }

    /**
     * Require specific permission
     */
    public static function requirePermission(string $permission): callable
    {
        return function (Request $request) use ($permission) {
            $user = Auth::user($request);
            if (!$user) {
                Response::unauthorized('Authentication required');
            }
            if ($user['role'] === 'super_admin') return; // super admin has all
            
            $perms = $user['permissions'] ?? [];
            if (!in_array($permission, $perms)) {
                Response::forbidden("Permission required: {$permission}");
            }
        };
    }

    /**
     * Optional auth - sets user if token present but doesn't fail
     */
    public static function optionalAuth(Request $request): void
    {
        // Just validates the token if present, no blocking
        Auth::user($request);
    }
}
