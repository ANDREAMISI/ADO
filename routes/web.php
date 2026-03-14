<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\AccessRequestController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\ProfileController;
use App\Services\DocumentConverter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use PhpOffice\PhpWord\PhpWord;


// Page d'accueil publique avec formulaire de demande
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Routes pour les demandes d'accès
Route::post('/web-api/access-request', [AccessRequestController::class, 'store']);

// Routes protégées par authentification
Route::middleware(['auth', 'active'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Routes Documents
    Route::prefix('documents')->name('documents.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Documents/Index');
        })->name('index');
        
        Route::get('/upload', function () {
            return Inertia::render('Documents/Upload');
        })->name('upload');
        
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('Documents/Edit', ['id' => $id]);
        })->name('edit');
        
        Route::get('/{id}', function ($id) {
            return Inertia::render('Documents/Show', ['id' => $id]);
        })->name('show');
    });

    // Routes Catégories
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Categories/Index');
        })->name('index');
        
        Route::get('/create', function () {
            return Inertia::render('Categories/Create');
        })->name('create');
        
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('Categories/Edit', ['id' => $id]);
        })->name('edit');
    });

    // Routes Tags
    Route::prefix('tags')->name('tags.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Tags/Index');
        })->name('index');
        
        Route::get('/create', function () {
            return Inertia::render('Tags/Create');
        })->name('create');
        
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('Tags/Edit', ['id' => $id]);
        })->name('edit');
    });
    
    // Routes Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Routes admin seulement
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        // NOUVELLE ROUTE POUR LES DEMANDES
        Route::get('/access-requests', function () {
            return Inertia::render('Admin/AccessRequest/Index');
        })->name('access-requests.index');
        
        Route::get('/access-logs', function () {
            return Inertia::render('AccessLogs/Index');
        })->name('logs.index');

        // Route stats accessible aux admins
        Route::get('/stats', function () {
            return Inertia::render('Stats/Index');
        })->name('stats.index');
    });
    
    // Routes utilisateurs (admin seulement)
    Route::middleware(['role:admin'])->prefix('users')->name('users.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Users/Index');
        })->name('index');
        
        Route::get('/create', function () {
            return Inertia::render('Users/Create');
        })->name('create');
        
        Route::get('/{id}/edit', function ($id) {
            return Inertia::render('Users/Edit', ['id' => $id]);
        })->name('edit');
    });
    
    Route::middleware(['auth'])->get('/access-logs', function () {
        return Inertia::render('AccessLogs/Index');
    })->name('access-logs');
    
    Route::middleware(['auth'])->get('/stats', function () {
        return Inertia::render('Stats/Index');
    })->name('stats');
    
    Route::middleware(['auth'])->get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('settings');
});

// Routes API-like via web 
Route::middleware(['auth'])->prefix('web-api')->name('api.')->group(function () {
    // Statistiques
    Route::get('/stats', [StatsController::class, 'index'])->name('stats.index');
    
    // Documents
    Route::prefix('documents')->name('documents.')->group(function () {
        Route::get('/', [DocumentController::class, 'index'])->name('index');
        Route::post('/', [DocumentController::class, 'store'])->name('store');
        Route::get('/{document}', [DocumentController::class, 'show'])->name('show');
        Route::put('/{document}', [DocumentController::class, 'update'])->name('update');
        Route::delete('/{document}', [DocumentController::class, 'destroy'])->name('destroy');
        Route::get('/{document}/download', [DocumentController::class, 'download'])->name('download');
        Route::get('/{id}/edit', [DocumentController::class, 'edit'])->name('edit');
        Route::get('/{document}/history', [DocumentController::class, 'history']);
        Route::get('/{document}/viewers', [DocumentController::class, 'viewers']);
           // NOUVELLE ROUTE POUR L'APERÇU
        Route::get('/{document}/preview', [DocumentController::class, 'preview'])->name('preview');
    });

    

    
    
    // Catégories
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::get('/{category}', [CategoryController::class, 'show'])->name('show');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
    });
    
    // Tags
    Route::prefix('tags')->name('tags.')->group(function () {
        Route::get('/', [TagController::class, 'index'])->name('index');
        Route::get('/popular', [TagController::class, 'popular'])->name('popular');
        Route::post('/', [TagController::class, 'store'])->name('store');
        Route::get('/{tag}', [TagController::class, 'show'])->name('show');
        Route::put('/{tag}', [TagController::class, 'update'])->name('update');
        Route::delete('/{tag}', [TagController::class, 'destroy'])->name('destroy');
    });
    
    // Utilisateurs (admin seulement)
    Route::middleware(['role:admin'])->prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/list', [UserController::class, 'list']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
        Route::patch('/{user}/toggle-active', [UserController::class, 'toggleActive']);
        Route::patch('/roles', [UserController::class, 'roles']);
        // pour approver l'acces a un nouveau user
        Route::get('/access-requests', [AccessRequestController::class, 'index']);
        Route::post('/access-requests/{id}/approve', [AccessRequestController::class, 'approve']);
        Route::post('/access-requests/{id}/reject', [AccessRequestController::class, 'reject']);
    });
    
    // Route pour récupérer les rôles (GET)
    Route::middleware(['auth'])->get('/roles', [UserController::class, 'roles']);
});

// Routes d'authentification (Breeze)
require __DIR__.'/auth.php';

