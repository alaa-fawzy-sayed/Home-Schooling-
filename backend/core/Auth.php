<?php
/**
 * Nova Learn - Authentication (JWT)
 * Handles token creation, validation, and user extraction
 */

namespace Core;

class Auth
{
    /**
     * Generate JWT token
     */
    public static function generateToken(array $payload): string
    {
        $header = self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        
        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true)
        );

        return "$header.$payloadEncoded.$signature";
    }

    /**
     * Validate and decode JWT token
     */
    public static function validateToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $signature] = $parts;

        // Verify signature
        $expectedSig = self::base64UrlEncode(
            hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)
        );
        if (!hash_equals($expectedSig, $signature)) return null;

        // Decode payload
        $data = json_decode(self::base64UrlDecode($payload), true);
        if (!$data) return null;

        // Check expiry
        if (isset($data['exp']) && $data['exp'] < time()) return null;

        return $data;
    }

    /**
     * Get authenticated user from request
     */
    public static function user(Request $request): ?array
    {
        $token = $request->bearerToken();
        if (!$token) return null;
        return self::validateToken($token);
    }

    /**
     * Hash password
     */
    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => BCRYPT_COST]);
    }

    /**
     * Verify password
     */
    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
