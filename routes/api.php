<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Admin\UserController;

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/stats', [StatsController::class, 'index']);
    
    // Documents
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::put('/documents/{document}', [DocumentController::class, 'update']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::get('/documents/{document}/edit', [DocumentController::class, 'edit']);
    Route::get('/documents/{document}/history', [DocumentController::class, 'history']);
    
    // Catégories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    
    // Tags
    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/tags', [TagController::class, 'store']);
    Route::get('/tags/{tag}', [TagController::class, 'show']);
    Route::put('/tags/{tag}', [TagController::class, 'update']);
    Route::delete('/tags/{tag}', [TagController::class, 'destroy']);
    Route::get('/tags/popular', [TagController::class, 'popular']);
    
    // Users (admin seulement)
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);
    Route::patch('/users/roles', [UserController::class, 'roles']);
    
    // Users - Rôles (pour les formulaires)
    Route::get('/roles', [UserController::class, 'roles']);
});
