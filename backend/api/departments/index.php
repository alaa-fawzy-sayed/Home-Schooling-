<?php
/**
 * Nova Learn API - List Departments (Public)
 */

use Core\{Database, Response};

function handleListDepartments($request): void
{
    $db = Database::getInstance();

    $departments = $db->fetchAll(
        "SELECT d.*, 
                (SELECT COUNT(*) FROM courses c WHERE c.department_id = d.id AND c.status = 'published') as active_courses,
                (SELECT COUNT(DISTINCT c.instructor_id) FROM courses c WHERE c.department_id = d.id) as instructors_count
         FROM departments d 
         WHERE d.status = 'active'
         ORDER BY d.students_count DESC"
    );

    Response::success($departments);
}
