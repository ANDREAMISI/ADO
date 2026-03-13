<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Afficher tous les tags (accessible à tous)
     */
    public function index()
    {
        $tags = Tag::orderBy('usage_count', 'desc')->get()->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'color' => $tag->color,
                'usage_count' => $tag->usage_count,
                'user_id' => $tag->user_id,
                'created_at' => $tag->created_at,
                'updated_at' => $tag->updated_at,
            ];
        });
        
        return response()->json([
            'data' => $tags
        ]);
    }

    /**
     * Créer un tag (admin et contributeur)
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        // Vérifier si l'utilisateur a le droit de créer des tags
        if (!$user->hasAnyRole(['admin', 'contributor'])) {
            return response()->json([
                'message' => 'Seuls les administrateurs et contributeurs peuvent créer des tags'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:tags',
            'color' => 'nullable|string|max:7'
        ]);

        $tag = Tag::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'color' => $request->color ?? '#3B82F6',
            'usage_count' => 0,
            'user_id' => $user->id
        ]);

        return response()->json([
            'message' => 'Tag créé avec succès',
            'tag' => $tag
        ], 201);
    }

    /**
     * Voir un tag (accessible à tous)
     */
    public function show(Tag $tag)
    {
        return response()->json([
            'tag' => $tag->load('documents')
        ]);
    }

    /**
     * Mettre à jour un tag (admin et contributeur)
     */
    public function update(Request $request, Tag $tag)
    {
        $user = auth()->user();
        
        // Vérifier si l'utilisateur est admin ou contributeur
        if (!$user->hasAnyRole(['admin', 'contributor'])) {
            return response()->json([
                'message' => 'Vous n\'avez pas la permission de modifier des tags'
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255|unique:tags,name,' . $tag->id,
            'color' => 'nullable|string|max:7'
        ]);

        $data = $request->only(['name', 'color']);
        
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $tag->update($data);

        return response()->json([
            'message' => 'Tag mis à jour avec succès',
            'tag' => $tag
        ]);
    }

    /**
     * Supprimer un tag (admin et contributeur)
     */
    public function destroy(Tag $tag)
    {
        $user = auth()->user();
        
        // Vérifier si l'utilisateur est admin ou contributeur
        if (!$user->hasAnyRole(['admin', 'contributor'])) {
            return response()->json([
                'message' => 'Vous n\'avez pas la permission de supprimer des tags'
            ], 403);
        }

        $tag->delete();

        return response()->json([
            'message' => 'Tag supprimé avec succès'
        ], 200);
    }

    /**
     * Tags populaires (accessible à tous)
     */
    public function popular()
    {
        $tags = Tag::orderBy('usage_count', 'desc')
            ->limit(10)
            ->get();
        
        return response()->json([
            'data' => $tags
        ]);
    }
}
