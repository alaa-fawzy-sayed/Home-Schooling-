<?php
/**
 * Nova Learn - Router
 * Lightweight PHP router with middleware support
 */

namespace Core;

class Router
{
    private array $routes = [];
    private array $globalMiddleware = [];

    public function addGlobalMiddleware(callable $middleware): void
    {
        $this->globalMiddleware[] = $middleware;
    }

    public function get(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }

    public function post(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }

    public function put(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }

    public function delete(string $path, callable $handler, array $middleware = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }

    private function addRoute(string $method, string $path, callable $handler, array $middleware): void
    {
        $this->routes[] = [
            'method'     => $method,
            'path'       => $path,
            'handler'    => $handler,
            'middleware'  => $middleware,
        ];
    }

    public function resolve(Request $request): void
    {
        $method = $request->method();
        $path   = $request->path();

        // Handle OPTIONS preflight
        if ($method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;

            $params = $this->matchPath($route['path'], $path);
            if ($params === false) continue;

            // Run global middleware
            foreach ($this->globalMiddleware as $mw) {
                $mw($request);
            }

            // Run route middleware
            foreach ($route['middleware'] as $mw) {
                $mw($request);
            }

            // Call handler
            call_user_func($route['handler'], $request, $params);
            return;
        }

        Response::notFound('Endpoint not found: ' . $method . ' ' . $path);
    }

    /**
     * Match a route path pattern against the actual URI path.
     * Supports {param} placeholders.
     * Returns associative array of params on match, or false.
     */
    private function matchPath(string $pattern, string $uri)
    {
        // Normalize
        $pattern = '/' . trim($pattern, '/');
        $uri     = '/' . trim($uri, '/');

        // Convert {param} to regex groups
        $regex = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $pattern);
        $regex = '#^' . $regex . '$#';

        if (preg_match($regex, $uri, $matches)) {
            return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        }

        return false;
    }
}
