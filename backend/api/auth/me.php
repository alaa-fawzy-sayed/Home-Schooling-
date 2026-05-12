<?php
/**
 * Nova Learn API - Get Current User
 */

use Core\{Database, Auth, Response};

function handleMe($request): void
{
    $payload = Auth::user($request);
    if (!$payload) {
        Response::unauthorized();
    }

    $db = Database::getInstance();
    $user = $db->fetch(
        "SELECT id, name_ar, name_en, email, username, phone, avatar, role, status, created_at, last_login_at FROM users WHERE id = ?",
        [$payload['user_id']]
    );

    if (!$user) {
        Response::notFound('User not found');
    }

    // Get enrolled courses count
    $enrolledCount = $db->count('enrollments', 'user_id = ? AND status = ?', [$user['id'], 'active']);

    // Get certificates count
    $certCount = $db->count('certificates', 'user_id = ?', [$user['id']]);

    $user['enrolled_courses_count'] = $enrolledCount;
    $user['certificates_count'] = $certCount;
    $user['permissions'] = $payload['permissions'] ?? [];

    Response::success($user);
}
