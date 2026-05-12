<?php
/**
 * Nova Learn API - Admin Announcements
 */

use Core\{Database, Auth, Validator, Response};

function handleListAnnouncements($request): void
{
    $db = Database::getInstance();
    $announcements = $db->fetchAll(
        "SELECT a.*, u.name_ar as author_name_ar, u.name_en as author_name_en
         FROM announcements a LEFT JOIN users u ON a.author_id = u.id
         ORDER BY a.is_pinned DESC, a.created_at DESC"
    );
    Response::success($announcements);
}

function handleCreateAnnouncement($request): void
{
    $db = Database::getInstance();
    $validator = new Validator();
    $data = $request->all();

    if (!$validator->validate($data, [
        'title_ar'   => 'required|string|min:3',
        'title_en'   => 'required|string|min:3',
        'content_ar' => 'required|string',
        'content_en' => 'required|string',
    ])) {
        Response::validationError($validator->errors());
    }

    $payload = Auth::user($request);
    $id = $db->insert('announcements', [
        'title_ar'   => $data['title_ar'],
        'title_en'   => $data['title_en'],
        'content_ar' => $data['content_ar'],
        'content_en' => $data['content_en'],
        'type'       => $data['type'] ?? 'info',
        'target'     => $data['target'] ?? 'all',
        'author_id'  => $payload['user_id'],
        'is_pinned'  => $data['is_pinned'] ?? false,
    ]);

    Response::created($db->fetch("SELECT * FROM announcements WHERE id = ?", [$id]));
}

function handleUpdateAnnouncement($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];

    $ann = $db->fetch("SELECT * FROM announcements WHERE id = ?", [$id]);
    if (!$ann) Response::notFound('Announcement not found');

    $data = $request->all();
    $updates = [];
    foreach (['title_ar','title_en','content_ar','content_en','type','target','is_pinned','status'] as $f) {
        if (isset($data[$f])) $updates[$f] = $data[$f];
    }

    if (!empty($updates)) $db->update('announcements', $updates, 'id = ?', [$id]);
    Response::success($db->fetch("SELECT * FROM announcements WHERE id = ?", [$id]), 'Updated');
}

function handleDeleteAnnouncement($request, $params): void
{
    $db = Database::getInstance();
    $id = (int) $params['id'];
    $db->delete('announcements', 'id = ?', [$id]);
    Response::deleted('Announcement deleted');
}
