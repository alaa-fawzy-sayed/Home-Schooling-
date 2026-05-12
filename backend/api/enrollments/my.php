<?php
/**
 * Nova Learn API - My Enrollments
 */

use Core\{Database, Auth, Response};

function handleMyEnrollments($request): void
{
    $payload = Auth::user($request);
    $userId  = $payload['user_id'];
    $db      = Database::getInstance();

    $enrollments = $db->fetchAll(
        "SELECT e.*, 
                c.title_ar, c.title_en, c.thumbnail, c.total_lessons, c.total_hours, c.level,
                u.name_ar as instructor_name_ar, u.name_en as instructor_name_en,
                d.name_ar as dept_name_ar, d.name_en as dept_name_en
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         JOIN users u ON c.instructor_id = u.id
         JOIN departments d ON c.department_id = d.id
         WHERE e.user_id = ?
         ORDER BY e.enrolled_at DESC",
        [$userId]
    );

    // Add progress for each enrollment
    foreach ($enrollments as &$enrollment) {
        $totalLessons = $db->count('lessons', 'course_id = ?', [$enrollment['course_id']]);
        $completedLessons = $db->count('lesson_progress', 'user_id = ? AND course_id = ? AND is_completed = 1', [$userId, $enrollment['course_id']]);
        $enrollment['total_lessons_count'] = $totalLessons;
        $enrollment['completed_lessons'] = $completedLessons;
        $enrollment['progress_percentage'] = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 1) : 0;
    }

    Response::success($enrollments);
}
