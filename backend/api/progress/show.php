<?php
/**
 * Nova Learn API - Show Course Progress
 */

use Core\{Database, Auth, Response};

function handleShowProgress($request, $params): void
{
    $payload = Auth::user($request);
    $userId  = $payload['user_id'];
    $db      = Database::getInstance();
    $courseId = (int) $params['courseId'];

    $enrollment = $db->fetch(
        "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
        [$userId, $courseId]
    );

    if (!$enrollment) {
        Response::notFound('Not enrolled in this course');
    }

    $lessonProgress = $db->fetchAll(
        "SELECT lp.*, l.title_ar, l.title_en, l.type
         FROM lesson_progress lp
         JOIN lessons l ON lp.lesson_id = l.id
         WHERE lp.user_id = ? AND lp.course_id = ?
         ORDER BY lp.last_watched_at DESC",
        [$userId, $courseId]
    );

    $totalLessons = $db->count('lessons', 'course_id = ?', [$courseId]);
    $completedLessons = $db->count('lesson_progress', 'user_id = ? AND course_id = ? AND is_completed = 1', [$userId, $courseId]);

    Response::success([
        'enrollment'       => $enrollment,
        'lesson_progress'  => $lessonProgress,
        'total_lessons'    => $totalLessons,
        'completed_lessons'=> $completedLessons,
        'percentage'       => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 1) : 0,
    ]);
}
