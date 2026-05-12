<?php
/**
 * Nova Learn API - Enrollment / Payment
 */

use Core\{Database, Auth, Validator, Response};

function handleCreateEnrollment($request): void
{
    $payload = Auth::user($request);
    $userId  = $payload['user_id'];
    $db      = Database::getInstance();

    $validator = new Validator();
    $data = $request->all();

    if (!$validator->validate($data, [
        'course_id'      => 'required|integer',
        'payment_method' => 'required|in:credit_card,e_wallet,fawry,free,coupon',
    ])) {
        Response::validationError($validator->errors());
    }

    $courseId = (int) $data['course_id'];
    $method   = $data['payment_method'];

    // Check course exists
    $course = $db->fetch("SELECT * FROM courses WHERE id = ? AND status = 'published'", [$courseId]);
    if (!$course) {
        Response::notFound('Course not found');
    }

    // Check not already enrolled
    $existing = $db->fetch(
        "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?",
        [$userId, $courseId]
    );
    if ($existing) {
        Response::error('Already enrolled in this course', 409);
    }

    // Calculate price
    $price = $course['discount_price'] ?: $course['price'];
    $couponCode = $data['coupon_code'] ?? null;
    $discount = 0;

    // Apply coupon if provided
    if ($couponCode) {
        $coupon = $db->fetch(
            "SELECT * FROM coupons WHERE code = ? AND status = 'active' AND (valid_until IS NULL OR valid_until > NOW())",
            [$couponCode]
        );
        if ($coupon) {
            if ($coupon['max_uses'] > 0 && $coupon['used_count'] >= $coupon['max_uses']) {
                Response::error('Coupon has been fully used');
            }
            if ($coupon['course_id'] && $coupon['course_id'] != $courseId) {
                Response::error('Coupon not valid for this course');
            }
            if ($coupon['discount_type'] === 'percentage') {
                $discount = $price * ($coupon['discount_value'] / 100);
            } else {
                $discount = $coupon['discount_value'];
            }
            $price = max(0, $price - $discount);

            // Increment coupon usage
            $db->update('coupons', ['used_count' => $coupon['used_count'] + 1], 'id = ?', [$coupon['id']]);
        }
    }

    // Free course
    if ($course['price'] == 0) {
        $price = 0;
        $method = 'free';
    }

    // Create enrollment in transaction
    $db->transaction(function ($db) use ($userId, $courseId, $method, $price, $couponCode, $course) {
        // Generate transaction ID
        $transactionId = 'TXN-' . strtoupper(bin2hex(random_bytes(8)));

        $db->insert('enrollments', [
            'user_id'        => $userId,
            'course_id'      => $courseId,
            'payment_method' => $method,
            'amount_paid'    => $price,
            'currency'       => $course['currency'] ?? 'EGP',
            'coupon_code'    => $couponCode,
            'transaction_id' => $transactionId,
            'status'         => 'active',
        ]);

        // Update course student count
        $db->query("UPDATE courses SET total_students = total_students + 1 WHERE id = ?", [$courseId]);

        // Update department student count
        $db->query("UPDATE departments SET students_count = students_count + 1 WHERE id = ?", [$course['department_id']]);
    });

    // Log activity
    $db->insert('activity_log', [
        'user_id'     => $userId,
        'action'      => 'enrollment',
        'entity_type' => 'course',
        'entity_id'   => $courseId,
        'details'     => json_encode(['amount' => $price, 'method' => $method]),
        'ip_address'  => $request->ip(),
    ]);

    $enrollment = $db->fetch(
        "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
        [$userId, $courseId]
    );

    Response::created([
        'enrollment' => $enrollment,
        'message_ar' => 'تم الاشتراك بنجاح! يمكنك الآن مشاهدة الكورس',
        'message_en' => 'Enrollment successful! You can now access the course',
    ], 'Enrollment successful');
}
