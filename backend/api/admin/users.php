<?php
/**
 * Nova Learn API - Admin Users Management
 */

use Core\{Database, Auth, Validator, Response};

function handleListUsers($request): void
{
    $db = Database::getInstance();
    $page = $request->page();
    $perPage = $request->perPage();
    $offset = ($page - 1) * $perPage;

    $role   = $request->input('role');
    $status = $request->input('status');
    $search = $request->input('search');

    $where = ['1=1'];
    $params = [];

    if ($role) { $where[] = "role = ?"; $params[] = $role; }
    if ($status) { $where[] = "status = ?"; $params[] = $status; }
    if ($search) { $where[] = "(name_ar LIKE ? OR name_en LIKE ? OR email LIKE ?)"; $s = "%{$search}%"; $params = array_merge($params, [$s, $s, $s]); }

    $whereStr = implode(' AND ', $where);
    $total = $db->count('users', $whereStr, $params);

    $users = $db->fetchAll(
        "SELECT id, name_ar, name_en, email, username, phone, avatar, role, status, last_login_at, created_at
         FROM users WHERE {$whereStr} ORDER BY created_at DESC LIMIT {$perPage} OFFSET {$offset}",
        $params
    );

    Response::paginated($users, $total, $page, $perPage);
}

function handleCreateUser($request): void
{
    $db = Database::getInstance();
    $validator = new Validator();
    $data = $request->all();

    if (!$validator->validate($data, [
        'name_ar'  => 'required|string|min:2',
        'name_en'  => 'required|string|min:2',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|min:8',
        'role'     => 'required|in:student,instructor,admin,moderator,super_admin',
    ])) {
        Response::validationError($validator->errors());
    }

    $userId = $db->insert('users', [
        'name_ar'  => $data['name_ar'],
        'name_en'  => $data['name_en'],
        'email'    => $data['email'],
        'username' => $data['username'] ?? explode('@', $data['email'])[0],
        'password' => Auth::hashPassword($data['password']),
        'phone'    => $data['phone'] ?? null,
        'role'     => $data['role'],
        'status'   => $data['status'] ?? 'active',
    ]);

    // Assign permissions if provided
    if (!empty($data['permissions'])) {
        $permStmt = $db->getConnection()->prepare(
            "INSERT IGNORE INTO user_permissions (user_id, permission_id) SELECT ?, id FROM permissions WHERE name = ?"
        );
        foreach ($data['permissions'] as $perm) {
            $permStmt->execute([$userId, $perm]);
        }
    }

    $payload = Auth::user($request);
    $db->insert('activity_log', [
        'user_id' => $payload['user_id'], 'action' => 'create_user',
        'entity_type' => 'user', 'entity_id' => $userId, 'ip_address' => $request->ip(),
    ]);

    $user = $db->fetch("SELECT id, name_ar, name_en, email, username, role, status FROM users WHERE id = ?", [$userId]);
    Response::created($user, 'User created successfully');
}

function handleUpdateUser($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $user = $db->fetch("SELECT * FROM users WHERE id = ?", [$id]);
    if (!$user) Response::notFound('User not found');

    $data = $request->all();
    $updates = [];
    foreach (['name_ar','name_en','email','username','phone','role','status'] as $f) {
        if (isset($data[$f])) $updates[$f] = $data[$f];
    }
    if (!empty($data['password'])) {
        $updates['password'] = Auth::hashPassword($data['password']);
    }

    if (!empty($updates)) {
        $db->update('users', $updates, 'id = ?', [$id]);
    }

    // Update permissions if provided
    if (isset($data['permissions'])) {
        $db->delete('user_permissions', 'user_id = ?', [$id]);
        $permStmt = $db->getConnection()->prepare(
            "INSERT IGNORE INTO user_permissions (user_id, permission_id) SELECT ?, id FROM permissions WHERE name = ?"
        );
        foreach ($data['permissions'] as $perm) {
            $permStmt->execute([$id, $perm]);
        }
    }

    Response::success($db->fetch("SELECT id, name_ar, name_en, email, username, role, status FROM users WHERE id = ?", [$id]), 'User updated');
}

function handleDeleteUser($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $user = $db->fetch("SELECT * FROM users WHERE id = ?", [$id]);
    if (!$user) Response::notFound('User not found');
    if ($user['role'] === 'super_admin') Response::forbidden('Cannot delete super admin');

    $db->delete('users', 'id = ?', [$id]);
    Response::deleted('User deleted');
}
