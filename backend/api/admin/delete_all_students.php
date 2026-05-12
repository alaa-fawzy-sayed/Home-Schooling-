<?php
/**
 * Nova Learn API - Delete All Student Accounts
 * ⚠️ DANGER: This will delete ALL student accounts!
 * Use with extreme caution!
 */

use Core\{Database, Auth, Response};

function handleDeleteAllStudents($request): void
{
    $payload = Auth::user($request);
    
    // Only super_admin can delete all students
    if ($payload['role'] !== 'super_admin') {
        Response::error('Only super admin can perform this action', 403);
    }

    $db = Database::getInstance();

    try {
        // Start transaction
        $db->query("START TRANSACTION");

        // Get count before deletion
        $studentCount = $db->count('users', "role = 'student'");

        // Delete related data first (foreign key constraints)
        
        // 1. Delete lesson progress
        $db->query("DELETE lp FROM lesson_progress lp 
                    JOIN users u ON lp.user_id = u.id 
                    WHERE u.role = 'student'");

        // 2. Delete certificates
        $db->query("DELETE cert FROM certificates cert 
                    JOIN users u ON cert.user_id = u.id 
                    WHERE u.role = 'student'");

        // 3. Delete reviews
        $db->query("DELETE r FROM reviews r 
                    JOIN users u ON r.user_id = u.id 
                    WHERE u.role = 'student'");

        // 4. Delete enrollments
        $db->query("DELETE e FROM enrollments e 
                    JOIN users u ON e.user_id = u.id 
                    WHERE u.role = 'student'");

        // 5. Delete user permissions
        $db->query("DELETE up FROM user_permissions up 
                    JOIN users u ON up.user_id = u.id 
                    WHERE u.role = 'student'");

        // 6. Delete activity logs
        $db->query("DELETE al FROM activity_log al 
                    JOIN users u ON al.user_id = u.id 
                    WHERE u.role = 'student'");

        // 7. Finally, delete student accounts
        $db->query("DELETE FROM users WHERE role = 'student'");

        // Commit transaction
        $db->query("COMMIT");

        // Log this critical action
        $db->insert('activity_log', [
            'user_id'     => $payload['user_id'],
            'action'      => 'delete_all_students',
            'entity_type' => 'user',
            'entity_id'   => null,
            'details'     => json_encode(['deleted_count' => $studentCount]),
            'ip_address'  => $request->ip(),
        ]);

        Response::success([
            'deleted_count' => $studentCount,
            'message' => "Successfully deleted {$studentCount} student accounts and all related data"
        ], 'All student accounts deleted successfully');

    } catch (Exception $e) {
        // Rollback on error
        $db->query("ROLLBACK");
        Response::error('Failed to delete student accounts: ' . $e->getMessage(), 500);
    }
}
