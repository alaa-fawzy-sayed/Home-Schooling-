<?php
/**
 * Nova Learn API - Update Lesson Progress
 */

use Core\{Database, Auth, Response};

function handleUpdateProgress($request): void
{
    $payload = Auth::user($request);
    $userId  = $payload['user_id'];
    $db      = Database::getInstance();

    $lessonId = (int) $request->input('lesson_id');
    $courseId = (int) $request->input('course_id');
    $watchedSeconds = (int) $request->input('watched_seconds', 0);
    $isCompleted = (bool) $request->input('is_completed', false);

    if (!$lessonId || !$courseId) {
        Response::error('lesson_id and course_id are required', 422);
    }

    // Verify enrollment
    $enrolled = $db->fetch(
        "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'active'",
        [$userId, $courseId]
    );
    if (!$enrolled) {
        Response::forbidden('Not enrolled in this course');
    }

    // Upsert progress
    $existing = $db->fetch(
        "SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
        [$userId, $lessonId]
    );

    if ($existing) {
        $updates = [
            'watched_seconds'  => $watchedSeconds,
            'last_watched_at'  => date('Y-m-d H:i:s'),
        ];
        if ($isCompleted) {
            $updates['is_completed'] = 1;
            $updates['completed_at'] = date('Y-m-d H:i:s');
        }
        $db->update('lesson_progress', $updates, 'id = ?', [$existing['id']]);
    } else {
        $db->insert('lesson_progress', [
            'user_id'         => $userId,
            'lesson_id'       => $lessonId,
            'course_id'       => $courseId,
            'watched_seconds' => $watchedSeconds,
            'is_completed'    => $isCompleted ? 1 : 0,
            'completed_at'    => $isCompleted ? date('Y-m-d H:i:s') : null,
        ]);
    }

    // Update enrollment progress
    $totalLessons = $db->count('lessons', 'course_id = ?', [$courseId]);
    $completedLessons = $db->count('lesson_progress', 'user_id = ? AND course_id = ? AND is_completed = 1', [$userId, $courseId]);
    $progress = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0;

    $enrollUpdate = ['progress' => $progress];
    if ($progress >= 100) {
        $enrollUpdate['completed_at'] = date('Y-m-d H:i:s');
    }
    $db->update('enrollments', $enrollUpdate, 'user_id = ? AND course_id = ?', [$userId, $courseId]);

    Response::success([
        'progress'          => $progress,
        'completed_lessons' => $completedLessons,
        'total_lessons'     => $totalLessons,
    ]);
}
