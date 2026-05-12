<?php
/**
 * Nova Learn API - Student Dashboard
 */

use Core\{Database, Auth, Response};

function handleDashboardOverview($request): void
{
    $payload = Auth::user($request);
    $userId = $payload['user_id'];
    $db = Database::getInstance();

    $user = $db->fetch(
        "SELECT id, name_ar, name_en, email, username, avatar, role, created_at FROM users WHERE id = ?",
        [$userId]
    );

    // Enrolled courses with progress
    $enrollments = $db->fetchAll(
        "SELECT e.*, c.title_ar, c.title_en, c.thumbnail, c.total_lessons, c.total_hours, c.level,
                c.rating, c.instructor_id,
                u.name_ar as instructor_name_ar, u.name_en as instructor_name_en
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         JOIN users u ON c.instructor_id = u.id
         WHERE e.user_id = ? AND e.status = 'active'
         ORDER BY e.enrolled_at DESC",
        [$userId]
    );

    foreach ($enrollments as &$enrollment) {
        $total = $db->count('lessons', 'course_id = ?', [$enrollment['course_id']]);
        $completed = $db->count('lesson_progress', 'user_id = ? AND course_id = ? AND is_completed = 1', [$userId, $enrollment['course_id']]);
        $enrollment['total_lessons_count'] = $total;
        $enrollment['completed_lessons'] = $completed;
        $enrollment['progress'] = $total > 0 ? round(($completed / $total) * 100, 1) : 0;
    }

    // Certificates
    $certificates = $db->fetchAll(
        "SELECT cert.*, c.title_ar as course_title_ar, c.title_en as course_title_en
         FROM certificates cert JOIN courses c ON cert.course_id = c.id
         WHERE cert.user_id = ?
         ORDER BY cert.issued_at DESC",
        [$userId]
    );

    // Recent activity
    $activity = $db->fetchAll(
        "SELECT lp.*, l.title_ar as lesson_title_ar, l.title_en as lesson_title_en,
                c.title_ar as course_title_ar, c.title_en as course_title_en
         FROM lesson_progress lp
         JOIN lessons l ON lp.lesson_id = l.id
         JOIN courses c ON lp.course_id = c.id
         WHERE lp.user_id = ?
         ORDER BY lp.last_watched_at DESC LIMIT 10",
        [$userId]
    );

    // Stats
    $stats = [
        'enrolled_courses'   => count($enrollments),
        'completed_courses'  => count(array_filter($enrollments, fn($e) => $e['progress'] >= 100)),
        'certificates'       => count($certificates),
        'total_watch_hours'  => round((float) ($db->fetchColumn(
            "SELECT COALESCE(SUM(watched_seconds), 0) / 3600 FROM lesson_progress WHERE user_id = ?", [$userId]
        ) ?? 0), 1),
        'current_streak'     => 0, // Calculated from consecutive daily activity
        'completed_lessons'  => $db->count('lesson_progress', 'user_id = ? AND is_completed = 1', [$userId]),
    ];

    // Announcements for students
    $announcements = $db->fetchAll(
        "SELECT * FROM announcements 
         WHERE status = 'active' AND target IN ('all', 'students')
         AND (expires_at IS NULL OR expires_at > NOW())
         ORDER BY is_pinned DESC, published_at DESC LIMIT 5"
    );

    Response::success([
        'user'          => $user,
        'stats'         => $stats,
        'enrollments'   => $enrollments,
        'certificates'  => $certificates,
        'recent_activity'=> $activity,
        'announcements' => $announcements,
    ]);
}

function handleDashboardGrades($request): void
{
    $payload = Auth::user($request);
    $userId = $payload['user_id'];
    $db = Database::getInstance();

    // Get completed courses with grades from certificates
    $grades = $db->fetchAll(
        "SELECT c.id, c.title_ar, c.title_en, c.total_hours,
                cert.grade, cert.type as cert_type, cert.issued_at,
                e.progress, e.completed_at
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         LEFT JOIN certificates cert ON cert.user_id = e.user_id AND cert.course_id = e.course_id
         WHERE e.user_id = ?
         ORDER BY e.enrolled_at DESC",
        [$userId]
    );

    // Calculate GPA (simplified)
    $totalPoints = 0;
    $totalCredits = 0;
    foreach ($grades as &$g) {
        $credits = max(1, (int) ($g['total_hours'] / 10));
        $g['credits'] = $credits;
        if ($g['grade']) {
            $points = min(4.0, $g['grade'] / 25);
            $g['points'] = round($points, 2);
            $g['grade_letter'] = $points >= 3.7 ? 'A' : ($points >= 3.3 ? 'A-' : ($points >= 3.0 ? 'B+' : ($points >= 2.7 ? 'B' : ($points >= 2.3 ? 'B-' : ($points >= 2.0 ? 'C+' : 'C')))));
            $totalPoints += $points * $credits;
            $totalCredits += $credits;
        }
    }

    $gpa = $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0;

    Response::success([
        'grades'        => $grades,
        'gpa'           => $gpa,
        'total_credits' => $totalCredits,
        'total_courses' => count($grades),
    ]);
}

function handleDashboardSchedule($request): void
{
    $payload = Auth::user($request);
    $userId = $payload['user_id'];
    $db = Database::getInstance();

    // Get active enrollments as schedule
    $enrollments = $db->fetchAll(
        "SELECT c.id, c.title_ar, c.title_en, c.total_hours,
                u.name_ar as instructor_name_ar, u.name_en as instructor_name_en,
                e.progress
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         JOIN users u ON c.instructor_id = u.id
         WHERE e.user_id = ? AND e.status = 'active' AND e.completed_at IS NULL
         ORDER BY c.title_ar",
        [$userId]
    );

    Response::success($enrollments);
}

function handleDashboardAchievements($request): void
{
    $payload = Auth::user($request);
    $userId = $payload['user_id'];
    $db = Database::getInstance();

    $completedCourses = $db->count('enrollments', "user_id = ? AND progress >= 100", [$userId]);
    $totalLessons = $db->count('lesson_progress', "user_id = ? AND is_completed = 1", [$userId]);
    $totalCerts = $db->count('certificates', "user_id = ?", [$userId]);
    $watchHours = round((float) ($db->fetchColumn("SELECT COALESCE(SUM(watched_seconds), 0) / 3600 FROM lesson_progress WHERE user_id = ?", [$userId]) ?? 0), 1);

    $achievements = [
        ['id' => 'first_course', 'title_ar' => 'أول كورس', 'title_en' => 'First Course', 'icon' => '🎯', 'unlocked' => $db->count('enrollments', 'user_id = ?', [$userId]) >= 1],
        ['id' => 'first_complete', 'title_ar' => 'أول إتمام', 'title_en' => 'First Completion', 'icon' => '✅', 'unlocked' => $completedCourses >= 1],
        ['id' => 'five_courses', 'title_ar' => '5 كورسات', 'title_en' => '5 Courses', 'icon' => '📚', 'unlocked' => $db->count('enrollments', 'user_id = ?', [$userId]) >= 5],
        ['id' => 'ten_lessons', 'title_ar' => '10 دروس', 'title_en' => '10 Lessons', 'icon' => '📝', 'unlocked' => $totalLessons >= 10],
        ['id' => 'fifty_lessons', 'title_ar' => '50 درس', 'title_en' => '50 Lessons', 'icon' => '🔥', 'unlocked' => $totalLessons >= 50],
        ['id' => 'first_cert', 'title_ar' => 'أول شهادة', 'title_en' => 'First Certificate', 'icon' => '🏆', 'unlocked' => $totalCerts >= 1],
        ['id' => 'watch_10h', 'title_ar' => '10 ساعات مشاهدة', 'title_en' => '10 Watch Hours', 'icon' => '⏰', 'unlocked' => $watchHours >= 10],
        ['id' => 'watch_100h', 'title_ar' => '100 ساعة مشاهدة', 'title_en' => '100 Watch Hours', 'icon' => '💎', 'unlocked' => $watchHours >= 100],
    ];

    Response::success([
        'achievements'     => $achievements,
        'stats' => [
            'completed_courses' => $completedCourses,
            'completed_lessons' => $totalLessons,
            'certificates'      => $totalCerts,
            'watch_hours'       => $watchHours,
        ],
    ]);
}
