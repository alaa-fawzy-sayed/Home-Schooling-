<?php
/**
 * Nova Learn API - List & Create Reviews
 */

use Core\{Database, Response};

function handleListReviews($request, $params): void
{
    $db = Database::getInstance();
    $courseId = (int) $params['id'];
    $page = $request->page();
    $perPage = $request->perPage();
    $offset = ($page - 1) * $perPage;

    $total = $db->count('reviews', "course_id = ? AND status = 'approved'", [$courseId]);

    $reviews = $db->fetchAll(
        "SELECT r.*, u.name_ar, u.name_en, u.avatar
         FROM reviews r JOIN users u ON r.user_id = u.id
         WHERE r.course_id = ? AND r.status = 'approved'
         ORDER BY r.created_at DESC
         LIMIT {$perPage} OFFSET {$offset}",
        [$courseId]
    );

    Response::paginated($reviews, $total, $page, $perPage);
}
