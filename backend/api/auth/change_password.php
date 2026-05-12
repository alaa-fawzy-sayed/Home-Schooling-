<?php
/**
 * Nova Learn API - Change Password
 */

use Core\{Database, Auth, Validator, Response};

function handleChangePassword($request): void
{
    $payload = Auth::user($request);
    $userId = $payload['user_id'];
    
    $validator = new Validator();
    $data = $request->all();

    if (!$validator->validate($data, [
        'current_password' => 'required|min:8',
        'new_password'     => 'required|min:8|max:100',
        'confirm_password' => 'required',
    ])) {
        Response::validationError($validator->errors());
    }

    // Check if new password matches confirmation
    if ($data['new_password'] !== $data['confirm_password']) {
        Response::error('New password and confirmation do not match', 422);
    }

    // Check if new password is different from current
    if ($data['current_password'] === $data['new_password']) {
        Response::error('New password must be different from current password', 422);
    }

    $db = Database::getInstance();
    
    // Get user's current password hash
    $user = $db->fetch("SELECT password FROM users WHERE id = ?", [$userId]);
    
    if (!$user) {
        Response::error('User not found', 404);
    }

    // Verify current password
    if (!Auth::verifyPassword($data['current_password'], $user['password'])) {
        Response::error('Current password is incorrect', 401);
    }

    // Hash new password
    $newPasswordHash = Auth::hashPassword($data['new_password']);

    // Update password
    $db->update('users', [
        'password' => $newPasswordHash,
        'updated_at' => date('Y-m-d H:i:s')
    ], 'id = ?', [$userId]);

    // Log activity
    $db->insert('activity_log', [
        'user_id'     => $userId,
        'action'      => 'password_changed',
        'entity_type' => 'user',
        'entity_id'   => $userId,
        'ip_address'  => $request->ip(),
    ]);

    Response::success(null, 'Password changed successfully');
}
