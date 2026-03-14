<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('documents')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'documents_count' => $category->documents_count,
                ];
            });

        return response()->json([
            'total_documents' => Document::count(),
            'total_categories' => Category::count(),
            'total_tags' => Tag::count(),
            'total_users' => User::count(),
            'categories' => $categories,
        ]);
    }
}