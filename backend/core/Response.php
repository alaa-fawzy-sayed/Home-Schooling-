<?php
/**
 * Nova Learn - JSON Response Helper
 */

namespace Core;

class Response
{
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success($data = null, string $message = 'Success', int $status = 200): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    public static function error(string $message = 'Error', int $status = 400, $errors = null): void
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        self::json($response, $status);
    }

    public static function paginated(array $data, int $total, int $page, int $perPage): void
    {
        self::json([
            'success'    => true,
            'data'       => $data,
            'pagination' => [
                'total'       => $total,
                'per_page'    => $perPage,
                'current_page'=> $page,
                'last_page'   => (int) ceil($total / $perPage),
                'has_more'    => ($page * $perPage) < $total,
            ],
        ]);
    }

    public static function created($data = null, string $message = 'Created successfully'): void
    {
        self::success($data, $message, 201);
    }

    public static function deleted(string $message = 'Deleted successfully'): void
    {
        self::success(null, $message);
    }

    public static function notFound(string $message = 'Resource not found'): void
    {
        self::error($message, 404);
    }

    public static function unauthorized(string $message = 'Unauthorized'): void
    {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden'): void
    {
        self::error($message, 403);
    }

    public static function validationError(array $errors): void
    {
        self::error('Validation failed', 422, $errors);
    }
}
