<?php
/**
 * Nova Learn API - Admin Permissions & Roles
 */

use Core\{Database, Auth, Response};

function handleListPermissions($request): void
{
    $db = Database::getInstance();

    $permissions = $db->fetchAll("SELECT * FROM permissions ORDER BY category, name");
    $roles = $db->fetchAll("SELECT * FROM roles ORDER BY id");

    foreach ($roles as &$role) {
        $role['permissions'] = array_column(
            $db->fetchAll(
                "SELECT p.name FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role_id = ?",
                [$role['id']]
            ), 'name'
        );
        $role['users_count'] = $db->count('users', "role = ?", [$role['name']]);
    }

    // Assigned instructors with their permissions
    $assignedUsers = $db->fetchAll(
        "SELECT u.id, u.name_ar, u.name_en, u.email, u.username, u.avatar, u.role, u.status,
                u.created_at
         FROM users u
         WHERE u.role IN ('instructor','admin','moderator')
         ORDER BY u.created_at DESC"
    );

    foreach ($assignedUsers as &$user) {
        $user['permissions'] = array_column(
            $db->fetchAll(
                "SELECT p.name FROM permissions p JOIN user_permissions up ON p.id = up.permission_id WHERE up.user_id = ?",
                [$user['id']]
            ), 'name'
        );
    }

    Response::success([
        'permissions'    => $permissions,
        'roles'          => $roles,
        'assigned_users' => $assignedUsers,
    ]);
}

function handleAssignPermissions($request): void
{
    $db = Database::getInstance();
    $userId = (int) $request->input('user_id');
    $permissions = $request->input('permissions', []);

    $user = $db->fetch("SELECT * FROM users WHERE id = ?", [$userId]);
    if (!$user) Response::notFound('User not found');

    // Update role if provided
    $newRole = $request->input('role');
    if ($newRole) {
        $db->update('users', ['role' => $newRole], 'id = ?', [$userId]);
    }

    // Update username/password if provided
    $updates = [];
    if ($request->input('username')) $updates['username'] = $request->input('username');
    if ($request->input('password')) $updates['password'] = Auth::hashPassword($request->input('password'));
    if (!empty($updates)) {
        $db->update('users', $updates, 'id = ?', [$userId]);
    }

    // Sync permissions
    $db->delete('user_permissions', 'user_id = ?', [$userId]);
    if (!empty($permissions)) {
        $stmt = $db->getConnection()->prepare(
            "INSERT INTO user_permissions (user_id, permission_id) SELECT ?, id FROM permissions WHERE name = ?"
        );
        foreach ($permissions as $perm) {
            $stmt->execute([$userId, $perm]);
        }
    }

    $payload = Auth::user($request);
    $db->insert('activity_log', [
        'user_id' => $payload['user_id'], 'action' => 'assign_permissions',
        'entity_type' => 'user', 'entity_id' => $userId,
        'details' => json_encode(['permissions' => $permissions]),
        'ip_address' => $request->ip(),
    ]);

    Response::success(null, 'Permissions assigned successfully');
}
