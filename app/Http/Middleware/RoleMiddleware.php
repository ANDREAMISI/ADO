<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        \Log::info('RoleMiddleware check', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'authenticated' => \Auth::check(),
            'user' => \Auth::check() ? \Auth::user()->name : null,
            'user_roles' => \Auth::check() ? \Auth::user()->getRoleNames()->toArray() : [],
            'required_roles' => $roles
        ]);

        if (!Auth::check()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $user = Auth::user();
        
        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Accès non autorisé - Rôle requis : ' . implode(', ', $roles)], 403);
    }
}