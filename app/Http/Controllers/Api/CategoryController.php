<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Afficher toutes les catégories (accessible à tous)
     */
    public function index()
    {
        $categories = Category::withCount('documents') 
            ->with('children')
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();
        
        return response()->json($categories);
    }

    /**
     * Créer une nouvelle catégorie (admin seulement)
     */
    public function store(Request $request)
    {
        // Vérifier si l'utilisateur est admin
        if (!auth()->user()->hasRole('admin')) {
            return response()->json([
                'message' => 'Seuls les administrateurs peuvent créer des catégories'
            ], 403);
        }

        Log::info('Tentative création catégorie', $request->all());
        
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'parent_id' => 'nullable|exists:categories,id'
            ]);

            $category = Category::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'parent_id' => $request->parent_id,
                'is_active' => true
            ]);

            return response()->json([
                'message' => 'Catégorie créée avec succès',
                'category' => $category
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Erreur création catégorie', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Erreur lors de la création',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Voir une catégorie (accessible à tous)
     */
    public function show(Category $category)
    {
        return response()->json([
            'category' => $category->load('children', 'parent')
        ]);
    }

    /**
     * Mettre à jour une catégorie (admin seulement)
     */
    public function update(Request $request, Category $category)
    {
        // Vérifier si l'utilisateur est admin
        if (!auth()->user()->hasRole('admin')) {
            return response()->json([
                'message' => 'Seuls les administrateurs peuvent modifier des catégories'
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'sometimes|boolean'
        ]);

        $data = $request->only(['name', 'description', 'parent_id', 'is_active']);
        
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return response()->json([
            'message' => 'Catégorie mise à jour avec succès',
            'category' => $category->fresh('parent')
        ]);
    }

    /**
     * Supprimer une catégorie (admin seulement)
     */
    public function destroy(Category $category)
    {
        // Vérifier si l'utilisateur est admin
        if (!auth()->user()->hasRole('admin')) {
            return response()->json([
                'message' => 'Seuls les administrateurs peuvent supprimer des catégories'
            ], 403);
        }

        if ($category->documents()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer une catégorie qui contient des documents'
            ], 422);
        }

        if ($category->children()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer une catégorie qui a des sous-catégories'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès'
        ], 200);
    }
}
