<?php
/**
 * Nova Learn API - Admin Departments
 */

use Core\{Database, Auth, Validator, Response};

function handleCreateDepartment($request): void
{
    $db = Database::getInstance();
    $validator = new Validator();
    $data = $request->all();

    if (!$validator->validate($data, [
        'name_ar' => 'required|string|min:2',
        'name_en' => 'required|string|min:2',
    ])) {
        Response::validationError($validator->errors());
    }

    $id = $db->insert('departments', [
        'name_ar'        => $data['name_ar'],
        'name_en'        => $data['name_en'],
        'description_ar' => $data['description_ar'] ?? null,
        'description_en' => $data['description_en'] ?? null,
        'icon'           => $data['icon'] ?? 'BookOpen',
        'color'          => $data['color'] ?? 'from-blue-400 to-cyan-600',
        'head_id'        => $data['head_id'] ?? null,
    ]);

    Response::created($db->fetch("SELECT * FROM departments WHERE id = ?", [$id]));
}

function handleUpdateDepartment($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $dept = $db->fetch("SELECT * FROM departments WHERE id = ?", [$id]);
    if (!$dept) Response::notFound('Department not found');

    $data = $request->all();
    $updates = [];
    foreach (['name_ar','name_en','description_ar','description_en','icon','color','head_id','status'] as $f) {
        if (isset($data[$f])) $updates[$f] = $data[$f];
    }

    if (!empty($updates)) $db->update('departments', $updates, 'id = ?', [$id]);
    Response::success($db->fetch("SELECT * FROM departments WHERE id = ?", [$id]), 'Department updated');
}

function handleDeleteDepartment($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $coursesCount = $db->count('courses', 'department_id = ?', [$id]);
    if ($coursesCount > 0) Response::error('Cannot delete department with courses. Move courses first.', 409);

    $db->delete('departments', 'id = ?', [$id]);
    Response::deleted('Department deleted');
}
