<?php
/**
 * Nova Learn API - Authentication: Login
 */

use Core\{Database, Auth, Validator, Response};

function handleLogin($request): void
{
    $email    = $request->input('email');
    $password = $request->input('password');

    if (!$email || !$password) {
        Response::error('Email and password are required', 422);
    }

    // Validate email format
    $validator = new Validator();
    if (!$validator->validate(['email' => $email], ['email' => 'required|email'])) {
        Response::validationError($validator->errors());
    }

    $db = Database::getInstance();
    $user = $db->fetch("SELECT * FROM users WHERE email = ? AND status = 'active'", [$email]);

    if (!$user || !Auth::verifyPassword($password, $user['password'])) {
        Response::error('Invalid email or password', 401);
    }

    // Get user permissions
    $permissions = $db->fetchAll(
        "SELECT p.name FROM permissions p 
         JOIN user_permissions up ON p.id = up.permission_id 
         WHERE up.user_id = ?",
        [$user['id']]
    );
    $permNames = array_column($permissions, 'name');

    $token = Auth::generateToken([
        'user_id'     => $user['id'],
        'email'       => $user['email'],
        'role'        => $user['role'],
        'permissions' => $permNames,
    ]);

    // Update last login
    $db->update('users', ['last_login_at' => date('Y-m-d H:i:s')], 'id = ?', [$user['id']]);

    // Log
    $db->insert('activity_log', [
        'user_id'     => $user['id'],
        'action'      => 'login',
        'entity_type' => 'user',
        'entity_id'   => $user['id'],
        'ip_address'  => $request->ip(),
    ]);

    unset($user['password']);

    Response::success([
        'user'  => $user,
        'token' => $token,
    ], 'Login successful');
}

function handleAdminLogin($request): void
{
    $email    = $request->input('email');
    $password = $request->input('password');

    if (!$email || !$password) {
        Response::error('Email and password are required', 422);
    }

    // Validate email format
    $validator = new Validator();
    if (!$validator->validate(['email' => $email], ['email' => 'required|email'])) {
        Response::validationError($validator->errors());
    }

    $db = Database::getInstance();
    $user = $db->fetch(
        "SELECT * FROM users WHERE email = ? AND role IN ('super_admin','admin','instructor') AND status = 'active'",
        [$email]
    );

    if (!$user || !Auth::verifyPassword($password, $user['password'])) {
        Response::error('Invalid credentials or insufficient access', 401);
    }

    // Get permissions
    $permissions = $db->fetchAll(
        "SELECT p.name FROM permissions p JOIN user_permissions up ON p.id = up.permission_id WHERE up.user_id = ?",
        [$user['id']]
    );
    $permNames = array_column($permissions, 'name');

    // Super admin gets all permissions
    if ($user['role'] === 'super_admin') {
        $permNames = array_column($db->fetchAll("SELECT name FROM permissions"), 'name');
    }

    $token = Auth::generateToken([
        'user_id'     => $user['id'],
        'email'       => $user['email'],
        'role'        => $user['role'],
        'permissions' => $permNames,
    ]);

    $db->update('users', ['last_login_at' => date('Y-m-d H:i:s')], 'id = ?', [$user['id']]);

    unset($user['password']);

    Response::success([
        'user'  => $user,
        'token' => $token,
    ], 'Admin login successful');
}
