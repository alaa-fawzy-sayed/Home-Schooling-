<?php
/**
 * Nova Learn API - Course Curriculum
 */

use Core\{Database, Response, Auth};

function handleGetCurriculum($request, $params): void
{
    $db = Database::getInstance();
    $courseId = (int) $params['id'];

    // Check course exists
    $course = $db->fetch("SELECT id, title_ar, title_en FROM courses WHERE id = ?", [$courseId]);
    if (!$course) {
        Response::notFound('Course not found');
    }

    // Check if user is enrolled
    $isEnrolled = false;
    $token = $request->bearerToken();
    if ($token) {
        $payload = Auth::validateToken($token);
        $userId = $payload['user_id'] ?? null;
        if ($userId) {
            $enrollment = $db->fetch(
                "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'active'",
                [$userId, $courseId]
            );
            $isEnrolled = $enrollment !== null;
        }
    }

    $sections = $db->fetchAll(
        "SELECT * FROM course_sections WHERE course_id = ? ORDER BY sort_order",
        [$courseId]
    );

    foreach ($sections as &$section) {
        $lessons = $db->fetchAll(
            "SELECT * FROM lessons WHERE section_id = ? ORDER BY sort_order",
            [$section['id']]
        );

        foreach ($lessons as &$lesson) {
            // Only show video_url if enrolled or lesson is free
            if (!$isEnrolled && !$lesson['is_free']) {
                $lesson['video_url'] = null;
                $lesson['resources'] = null;
            }
            $lesson['accessible'] = $isEnrolled || (bool) $lesson['is_free'];
        }

        $section['lessons'] = $lessons;
    }

    Response::success([
        'course'      => $course,
        'is_enrolled' => $isEnrolled,
        'sections'    => $sections,
    ]);
}
