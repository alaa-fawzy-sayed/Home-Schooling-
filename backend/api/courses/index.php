<?php
/**
 * Nova Learn API - List Courses (Public)
 */

use Core\{Database, Response, Auth};

function handleListCourses($request): void
{
    $db = Database::getInstance();
    $page    = $request->page();
    $perPage = $request->perPage();
    $offset  = ($page - 1) * $perPage;

    // Filters
    $dept   = $request->input('department');
    $level  = $request->input('level');
    $search = $request->input('search');
    $sort   = $request->input('sort', 'newest');

    $where = ["c.status = 'published'"];
    $params = [];

    if ($dept) {
        $where[] = "c.department_id = ?";
        $params[] = $dept;
    }
    if ($level) {
        $where[] = "c.level = ?";
        $params[] = $level;
    }
    if ($search) {
        $where[] = "(c.title_ar LIKE ? OR c.title_en LIKE ? OR u.name_en LIKE ?)";
        $s = "%{$search}%";
        $params = array_merge($params, [$s, $s, $s]);
    }

    $whereStr = implode(' AND ', $where);

    $orderBy = match ($sort) {
        'popular'  => 'c.total_students DESC',
        'rating'   => 'c.rating DESC',
        'price_low'  => 'COALESCE(c.discount_price, c.price) ASC',
        'price_high' => 'COALESCE(c.discount_price, c.price) DESC',
        default    => 'c.created_at DESC',
    };

    $total = $db->fetchColumn(
        "SELECT COUNT(*) FROM courses c JOIN users u ON c.instructor_id = u.id WHERE {$whereStr}",
        $params
    );

    $courses = $db->fetchAll(
        "SELECT c.*, 
                d.name_ar as dept_name_ar, d.name_en as dept_name_en, d.color as dept_color,
                u.name_ar as instructor_name_ar, u.name_en as instructor_name_en, u.avatar as instructor_avatar
         FROM courses c
         JOIN departments d ON c.department_id = d.id
         JOIN users u ON c.instructor_id = u.id
         WHERE {$whereStr}
         ORDER BY {$orderBy}
         LIMIT {$perPage} OFFSET {$offset}",
        $params
    );

    // Check enrollment status if authenticated
    $token = $request->bearerToken();
    $userId = null;
    if ($token) {
        $payload = Auth::validateToken($token);
        $userId = $payload['user_id'] ?? null;
    }

    if ($userId) {
        $enrolledIds = array_column(
            $db->fetchAll("SELECT course_id FROM enrollments WHERE user_id = ? AND status = 'active'", [$userId]),
            'course_id'
        );
        foreach ($courses as &$course) {
            $course['is_enrolled'] = in_array($course['id'], $enrolledIds);
        }
    }

    Response::paginated($courses, (int)$total, $page, $perPage);
}
