<?php
/**
 * Nova Learn API - Admin Dashboard Stats
 */

use Core\{Database, Response};

function handleAdminStats($request): void
{
    $db = Database::getInstance();

    $stats = [
        'total_students'    => $db->count('users', "role = 'student'"),
        'total_instructors' => $db->count('users', "role = 'instructor'"),
        'total_courses'     => $db->count('courses'),
        'published_courses' => $db->count('courses', "status = 'published'"),
        'total_departments' => $db->count('departments'),
        'total_enrollments' => $db->count('enrollments'),
        'active_enrollments'=> $db->count('enrollments', "status = 'active'"),
        'total_revenue'     => (float) ($db->fetchColumn("SELECT COALESCE(SUM(amount_paid), 0) FROM enrollments WHERE status = 'active'") ?? 0),
        'total_certificates'=> $db->count('certificates'),
        'pending_reviews'   => $db->count('reviews', "status = 'pending'"),
    ];

    // Revenue by month (last 6 months)
    $stats['revenue_by_month'] = $db->fetchAll(
        "SELECT DATE_FORMAT(enrolled_at, '%Y-%m') as month, SUM(amount_paid) as revenue, COUNT(*) as enrollments
         FROM enrollments WHERE status = 'active' AND enrolled_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY month ORDER BY month"
    );

    // Top courses by enrollment
    $stats['top_courses'] = $db->fetchAll(
        "SELECT c.id, c.title_ar, c.title_en, c.total_students, c.rating, c.thumbnail
         FROM courses c ORDER BY c.total_students DESC LIMIT 5"
    );

    // Recent enrollments
    $stats['recent_enrollments'] = $db->fetchAll(
        "SELECT e.*, u.name_ar, u.name_en, u.avatar, c.title_ar as course_title_ar, c.title_en as course_title_en
         FROM enrollments e JOIN users u ON e.user_id = u.id JOIN courses c ON e.course_id = c.id
         ORDER BY e.enrolled_at DESC LIMIT 10"
    );

    // Department distribution
    $stats['dept_distribution'] = $db->fetchAll(
        "SELECT d.name_ar, d.name_en, d.students_count, d.courses_count
         FROM departments d ORDER BY d.students_count DESC"
    );

    Response::success($stats);
}
