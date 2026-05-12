<?php
/**
 * Nova Learn API - Admin Settings
 */

use Core\{Database, Auth, Response};

function handleGetSettings($request): void
{
    $db = Database::getInstance();
    $settings = $db->fetchAll("SELECT * FROM settings ORDER BY category, setting_key");

    $grouped = [];
    foreach ($settings as $s) {
        $grouped[$s['category']][$s['setting_key']] = $s['setting_value'];
    }

    Response::success($grouped);
}

function handleUpdateSettings($request): void
{
    $db = Database::getInstance();
    $data = $request->all();

    foreach ($data as $key => $value) {
        $existing = $db->fetch("SELECT id FROM settings WHERE setting_key = ?", [$key]);
        if ($existing) {
            $db->update('settings', ['setting_value' => $value], 'setting_key = ?', [$key]);
        } else {
            $db->insert('settings', ['setting_key' => $key, 'setting_value' => $value]);
        }
    }

    $payload = Auth::user($request);
    $db->insert('activity_log', [
        'user_id' => $payload['user_id'], 'action' => 'update_settings',
        'entity_type' => 'settings', 'details' => json_encode(array_keys($data)),
        'ip_address' => $request->ip(),
    ]);

    Response::success(null, 'Settings updated successfully');
}
