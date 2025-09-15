<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LoggerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Handle the request and get the response
        $response = $next($request);

        // Get request headers
        $headers = $request->header();

        // Prepare the log data
        $dt = new Carbon();
        $data = [
            'path' => $request->getPathInfo(),
            'method' => $request->getMethod(),
            'ip' => $request->ip(),
            'http_version' => $_SERVER['SERVER_PROTOCOL'] ?? null,
            'timestamp' => $dt->toDateTimeString(),
            'headers' => [
                'accept' => $headers['accept'] ?? null,
                'content-type' => $headers['content-type'] ?? null,
                'authorization' => $headers['authorization'] ?? null,
            ],
        ];

        if ($request->user()) {
            $data['user_id'] = $request->user()->id;
        }

        if (count($request->all()) > 0) {
            $hiddenKeys = ['password'];
            $data['request'] = $request->except($hiddenKeys);
        }

        // Add response content (only for JSON responses to avoid logging binary files, etc.)
        if ($response->headers->get('Content-Type') === 'application/json') {
            $content = $response->getContent();

            // Decode content if it's JSON
            $data['response'] = json_decode($content, true);
        }

        $message = str_replace('/', '_', trim($request->getPathInfo(), '/')) ?: 'root';
        Log::info($message, $data);

        return $response;
    }
}
