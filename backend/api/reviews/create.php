<?php
/**
 * Nova Learn API - Create Review
 */

use Core\{Database, Auth, Validator, Response};

function handleCreateReview($request, $params): void
{
    $payload = Auth::user($request);
    $userId = $payload['user_id'];
    $courseId = (int) $params['id'];
    $db = Database::getInstance();

    $validator = new Validator();
    if (!$validator->validate($request->all(), [
        'rating'  => 'required|integer|min:1|max:5',
        'comment' => 'string|max:1000',
    ])) {
        Response::validationError($validator->errors());
    }

    // Check enrollment
    $enrolled = $db->fetch("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'active'", [$userId, $courseId]);
    if (!$enrolled) {
        Response::forbidden('You must be enrolled to review this course');
    }

    // Check existing review
    $existing = $db->fetch("SELECT id FROM reviews WHERE user_id = ? AND course_id = ?", [$userId, $courseId]);
    if ($existing) {
        Response::error('You already reviewed this course', 409);
    }

    $reviewId = $db->insert('reviews', [
        'user_id'   => $userId,
        'course_id' => $courseId,
        'rating'    => (int) $request->input('rating'),
        'comment'   => $request->input('comment'),
        'status'    => 'approved',
    ]);

    // Update course rating
    $avgRating = $db->fetchColumn("SELECT AVG(rating) FROM reviews WHERE course_id = ? AND status = 'approved'", [$courseId]);
    $ratingCount = $db->count('reviews', "course_id = ? AND status = 'approved'", [$courseId]);
    $db->update('courses', ['rating' => round($avgRating, 1), 'rating_count' => $ratingCount], 'id = ?', [$courseId]);

    Response::created(['review_id' => $reviewId], 'Review submitted');
}
