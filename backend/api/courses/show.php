<?php
/**
 * Nova Learn API - Show Single Course (Public)
 */

use Core\{Database, Response, Auth};

function handleShowCourse($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $course = $db->fetch(
        "SELECT c.*, 
                d.name_ar as dept_name_ar, d.name_en as dept_name_en, d.color as dept_color, d.icon as dept_icon,
                u.name_ar as instructor_name_ar, u.name_en as instructor_name_en, u.avatar as instructor_avatar, u.email as instructor_email
         FROM courses c
         JOIN departments d ON c.department_id = d.id
         JOIN users u ON c.instructor_id = u.id
         WHERE c.id = ?",
        [$id]
    );

    if (!$course) {
        Response::notFound('Course not found');
    }

    // Get sections with lessons
    $sections = $db->fetchAll(
        "SELECT * FROM course_sections WHERE course_id = ? ORDER BY sort_order",
        [$id]
    );

    foreach ($sections as &$section) {
        $section['lessons'] = $db->fetchAll(
            "SELECT id, title_ar, title_en, video_duration, type, is_free, sort_order 
             FROM lessons WHERE section_id = ? ORDER BY sort_order",
            [$section['id']]
        );
    }

    $course['sections'] = $sections;

    // Reviews summary
    $course['reviews_summary'] = $db->fetch(
        "SELECT COUNT(*) as total, AVG(rating) as avg_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
         FROM reviews WHERE course_id = ? AND status = 'approved'",
        [$id]
    );

    // Check enrollment
    $token = $request->bearerToken();
    if ($token) {
        $payload = Auth::validateToken($token);
        $userId = $payload['user_id'] ?? null;
        if ($userId) {
            $enrollment = $db->fetch(
                "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'active'",
                [$userId, $id]
            );
            $course['is_enrolled'] = $enrollment !== null;
            $course['enrollment'] = $enrollment;
        }
    }

    // Related courses
    $course['related_courses'] = $db->fetchAll(
        "SELECT c.id, c.title_ar, c.title_en, c.thumbnail, c.price, c.discount_price, c.rating, c.total_students, c.level
         FROM courses c WHERE c.department_id = ? AND c.id != ? AND c.status = 'published' LIMIT 4",
        [$course['department_id'], $id]
    );

    Response::success($course);
}
