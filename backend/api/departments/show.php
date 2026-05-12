<?php
/**
 * Nova Learn API - Show Department
 */

use Core\{Database, Response};

function handleShowDepartment($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $dept = $db->fetch("SELECT * FROM departments WHERE id = ?", [$id]);
    if (!$dept) {
        Response::notFound('Department not found');
    }

    $dept['courses'] = $db->fetchAll(
        "SELECT c.*, u.name_ar as instructor_name_ar, u.name_en as instructor_name_en
         FROM courses c JOIN users u ON c.instructor_id = u.id
         WHERE c.department_id = ? AND c.status = 'published'
         ORDER BY c.rating DESC",
        [$id]
    );

    $dept['top_instructors'] = $db->fetchAll(
        "SELECT DISTINCT u.id, u.name_ar, u.name_en, u.avatar, u.email,
                COUNT(c.id) as courses_count, SUM(c.total_students) as total_students
         FROM users u JOIN courses c ON u.id = c.instructor_id
         WHERE c.department_id = ?
         GROUP BY u.id ORDER BY total_students DESC LIMIT 5",
        [$id]
    );

    Response::success($dept);
}
