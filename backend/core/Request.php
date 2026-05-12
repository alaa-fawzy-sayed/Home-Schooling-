<?php
/**
 * Nova Learn - Request Helper
 */

namespace Core;

class Request
{
    private array $body;
    private array $query;
    private array $files;
    private string $method;
    private string $path;

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $this->query  = $_GET;
        $this->files  = $_FILES;

        // Parse body
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input');
            $this->body = json_decode($raw, true) ?? [];
        } else {
            $this->body = $_POST;
        }
    }

    public function method(): string { return $this->method; }
    public function path(): string { return $this->path; }
    public function isGet(): bool { return $this->method === 'GET'; }
    public function isPost(): bool { return $this->method === 'POST'; }
    public function isPut(): bool { return $this->method === 'PUT'; }
    public function isDelete(): bool { return $this->method === 'DELETE'; }

    /**
     * Get input from body or query
     */
    public function input(string $key, $default = null)
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }

    /**
     * Get all body data
     */
    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    /**
     * Get only specified keys
     */
    public function only(array $keys): array
    {
        $data = $this->all();
        return array_intersect_key($data, array_flip($keys));
    }

    /**
     * Check if input exists
     */
    public function has(string $key): bool
    {
        return isset($this->body[$key]) || isset($this->query[$key]);
    }

    /**
     * Get query parameter
     */
    public function query(string $key, $default = null)
    {
        return $this->query[$key] ?? $default;
    }

    /**
     * Get uploaded file
     */
    public function file(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    /**
     * Get authorization header / bearer token
     */
    public function bearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Get page number for pagination
     */
    public function page(): int
    {
        return max(1, (int) ($this->query['page'] ?? 1));
    }

    /**
     * Get per_page for pagination
     */
    public function perPage(): int
    {
        $pp = (int) ($this->query['per_page'] ?? DEFAULT_PER_PAGE);
        return min(max(1, $pp), MAX_PER_PAGE);
    }

    /**
     * Get client IP
     */
    public function ip(): string
    {
        return $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}
