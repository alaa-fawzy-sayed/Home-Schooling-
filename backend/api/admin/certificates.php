<?php
/**
 * Nova Learn API - Admin Certificates
 */

use Core\{Database, Auth, Response};

function handleListCertificates($request): void
{
    $db = Database::getInstance();
    $page = $request->page();
    $perPage = $request->perPage();
    $offset = ($page - 1) * $perPage;

    $total = $db->count('certificates');
    $certs = $db->fetchAll(
        "SELECT cert.*, u.name_ar, u.name_en, u.email, u.avatar,
                c.title_ar as course_title_ar, c.title_en as course_title_en
         FROM certificates cert
         JOIN users u ON cert.user_id = u.id
         JOIN courses c ON cert.course_id = c.id
         ORDER BY cert.issued_at DESC
         LIMIT {$perPage} OFFSET {$offset}",
        []
    );

    Response::paginated($certs, $total, $page, $perPage);
}

function handleIssueCertificate($request): void
{
    $db = Database::getInstance();
    $userId = (int) $request->input('user_id');
    $courseId = (int) $request->input('course_id');
    $type = $request->input('type', 'completion');
    $grade = $request->input('grade');

    if (!$userId || !$courseId) {
        Response::error('user_id and course_id are required', 422);
    }

    // Verify enrollment
    $enrollment = $db->fetch(
        "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'active'",
        [$userId, $courseId]
    );
    if (!$enrollment) {
        Response::error('Student is not enrolled in this course', 409);
    }

    // Check existing certificate
    $existing = $db->fetch("SELECT id FROM certificates WHERE user_id = ? AND course_id = ?", [$userId, $courseId]);
    if ($existing) {
        Response::error('Certificate already issued', 409);
    }

    // Generate certificate number
    $certNumber = 'NOVA-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));

    $certId = $db->insert('certificates', [
        'user_id'            => $userId,
        'course_id'          => $courseId,
        'certificate_number' => $certNumber,
        'type'               => $type,
        'grade'              => $grade,
    ]);

    $payload = Auth::user($request);
    $db->insert('activity_log', [
        'user_id' => $payload['user_id'], 'action' => 'issue_certificate',
        'entity_type' => 'certificate', 'entity_id' => $certId, 'ip_address' => $request->ip(),
    ]);

    $cert = $db->fetch("SELECT * FROM certificates WHERE id = ?", [$certId]);
    Response::created($cert, 'Certificate issued: ' . $certNumber);
}
