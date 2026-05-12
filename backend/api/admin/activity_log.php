<?php
/**
 * Nova Learn API - Admin Activity Log
 */

use Core\{Database, Response};

function handleGetActivityLog($request): void
{
    $db = Database::getInstance();
    $page = $request->page();
    $perPage = $request->perPage();
    $offset = ($page - 1) * $perPage;

    $action = $request->input('action');
    $userId = $request->input('user_id');

    $where = ['1=1'];
    $params = [];

    if ($action) { $where[] = "al.action = ?"; $params[] = $action; }
    if ($userId) { $where[] = "al.user_id = ?"; $params[] = $userId; }

    $whereStr = implode(' AND ', $where);
    $total = $db->fetchColumn("SELECT COUNT(*) FROM activity_log al WHERE {$whereStr}", $params);

    $logs = $db->fetchAll(
        "SELECT al.*, u.name_ar, u.name_en, u.email, u.avatar
         FROM activity_log al LEFT JOIN users u ON al.user_id = u.id
         WHERE {$whereStr}
         ORDER BY al.created_at DESC
         LIMIT {$perPage} OFFSET {$offset}",
        $params
    );

    Response::paginated($logs, (int) $total, $page, $perPage);
}
