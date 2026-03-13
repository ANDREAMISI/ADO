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
        return response()->json([
            'total_documents' => Document::count(),
            'total_categories' => Category::count(),
            'total_tags' => Tag::count(),
            'total_users' => User::count(),
        ]);
    }
}