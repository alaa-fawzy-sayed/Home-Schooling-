<?php
/**
 * Nova Learn API - Admin Courses CRUD
 */

use Core\{Database, Auth, Validator, Response};

function handleCreateCourse($request): void
{
    $db = Database::getInstance();
    $validator = new Validator();
    $data = $request->all();

    if (!$validator->validate($data, [
        'title_ar'       => 'required|string|min:3|max:500',
        'title_en'       => 'required|string|min:3|max:500',
        'department_id'  => 'required|integer',
        'instructor_id'  => 'required|integer',
        'price'          => 'required|numeric|min:0',
        'level'          => 'required|in:beginner,intermediate,advanced',
    ])) {
        Response::validationError($validator->errors());
    }

    $courseId = $db->insert('courses', [
        'title_ar'       => $data['title_ar'],
        'title_en'       => $data['title_en'],
        'description_ar' => $data['description_ar'] ?? null,
        'description_en' => $data['description_en'] ?? null,
        'department_id'  => (int) $data['department_id'],
        'instructor_id'  => (int) $data['instructor_id'],
        'price'          => (float) $data['price'],
        'discount_price' => isset($data['discount_price']) ? (float) $data['discount_price'] : null,
        'level'          => $data['level'],
        'total_hours'    => (float) ($data['total_hours'] ?? 0),
        'total_lessons'  => (int) ($data['total_lessons'] ?? 0),
        'thumbnail'      => $data['thumbnail'] ?? null,
        'status'         => $data['status'] ?? 'draft',
    ]);

    // Update department course count
    $db->query("UPDATE departments SET courses_count = courses_count + 1 WHERE id = ?", [(int) $data['department_id']]);

    $payload = Auth::user($request);
    $db->insert('activity_log', [
        'user_id' => $payload['user_id'], 'action' => 'create_course',
        'entity_type' => 'course', 'entity_id' => $courseId, 'ip_address' => $request->ip(),
    ]);

    $course = $db->fetch("SELECT * FROM courses WHERE id = ?", [$courseId]);
    Response::created($course, 'Course created successfully');
}

function handleUpdateCourse($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $course = $db->fetch("SELECT * FROM courses WHERE id = ?", [$id]);
    if (!$course) Response::notFound('Course not found');

    $data = $request->all();
    $updates = [];
    $fields = ['title_ar','title_en','description_ar','description_en','department_id','instructor_id','price','discount_price','level','total_hours','total_lessons','thumbnail','status','is_featured'];

    foreach ($fields as $f) {
        if (isset($data[$f])) $updates[$f] = $data[$f];
    }

    if (!empty($updates)) {
        $db->update('courses', $updates, 'id = ?', [$id]);
    }

    $payload = Auth::user($request);
    $db->insert('activity_log', [
        'user_id' => $payload['user_id'], 'action' => 'update_course',
        'entity_type' => 'course', 'entity_id' => $id, 'ip_address' => $request->ip(),
    ]);

    Response::success($db->fetch("SELECT * FROM courses WHERE id = ?", [$id]), 'Course updated');
}

function handleDeleteCourse($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $course = $db->fetch("SELECT * FROM courses WHERE id = ?", [$id]);
    if (!$course) Response::notFound('Course not found');

    $db->delete('courses', 'id = ?', [$id]);
    $db->query("UPDATE departments SET courses_count = GREATEST(courses_count - 1, 0) WHERE id = ?", [$course['department_id']]);

    $payload = Auth::user($request);
    $db->insert('activity_log', [
        'user_id' => $payload['user_id'], 'action' => 'delete_course',
        'entity_type' => 'course', 'entity_id' => $id, 'ip_address' => $request->ip(),
    ]);

    Response::deleted('Course deleted');
}
