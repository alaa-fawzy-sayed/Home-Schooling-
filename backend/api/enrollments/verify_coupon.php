<?php
/**
 * Nova Learn API - Verify Coupon
 */

use Core\{Database, Response};

function handleVerifyCoupon($request): void
{
    $code = $request->input('code');
    $courseId = $request->input('course_id');

    if (!$code) {
        Response::error('Coupon code is required', 422);
    }

    $db = Database::getInstance();
    $coupon = $db->fetch(
        "SELECT * FROM coupons WHERE code = ? AND status = 'active'",
        [$code]
    );

    if (!$coupon) {
        Response::error('Invalid coupon code', 404);
    }

    if ($coupon['valid_until'] && strtotime($coupon['valid_until']) < time()) {
        Response::error('Coupon has expired', 410);
    }

    if ($coupon['max_uses'] > 0 && $coupon['used_count'] >= $coupon['max_uses']) {
        Response::error('Coupon has reached maximum uses');
    }

    if ($coupon['course_id'] && $courseId && $coupon['course_id'] != $courseId) {
        Response::error('Coupon not valid for this course');
    }

    Response::success([
        'code'           => $coupon['code'],
        'discount_type'  => $coupon['discount_type'],
        'discount_value' => $coupon['discount_value'],
        'min_amount'     => $coupon['min_amount'],
    ], 'Coupon is valid');
}
