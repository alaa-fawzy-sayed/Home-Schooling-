<?php
/**
 * Nova Learn API - Authentication: Register
 */

use Core\{Database, Auth, Validator, Response};

function handleRegister($request): void
{
    $validator = new Validator();
    $data = $request->all();

    if (!$validator->validate($data, [
        'name_ar'  => 'required|string|min:2|max:255',
        'name_en'  => 'required|string|min:2|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|min:8|max:100',
        'phone'    => 'string|max:20',
    ])) {
        Response::validationError($validator->errors());
    }

    $db = Database::getInstance();

    $userId = $db->insert('users', [
        'name_ar'  => $data['name_ar'],
        'name_en'  => $data['name_en'],
        'email'    => $data['email'],
        'username' => explode('@', $data['email'])[0],
        'password' => Auth::hashPassword($data['password']),
        'phone'    => $data['phone'] ?? null,
        'role'     => 'student',
        'status'   => 'active',
    ]);

    $user = $db->fetch("SELECT id, name_ar, name_en, email, role, avatar FROM users WHERE id = ?", [$userId]);

    $token = Auth::generateToken([
        'user_id' => $user['id'],
        'email'   => $user['email'],
        'role'    => $user['role'],
    ]);

    // Log activity
    $db->insert('activity_log', [
        'user_id'     => $userId,
        'action'      => 'register',
        'entity_type' => 'user',
        'entity_id'   => $userId,
        'ip_address'  => $request->ip(),
    ]);

    Response::created([
        'user'  => $user,
        'token' => $token,
    ], 'Registration successful');
}
