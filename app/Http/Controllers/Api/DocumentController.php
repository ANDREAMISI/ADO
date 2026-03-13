<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Afficher la liste des documents avec recherche et filtres
     */
    public function index(Request $request)
    {
        try {
            $query = Document::with(['category', 'user', 'tags']);

            // RECHERCHE PAR MOT-CLÉ
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', "%{$searchTerm}%")
                        ->orWhere('description', 'like', "%{$searchTerm}%");
                });
            }

            // FILTRE PAR CATÉGORIE
            if ($request->has('category_id') && !empty($request->category_id)) {
                $query->where('category_id', $request->category_id);
            }

            // FILTRE PAR TAGS
            if ($request->has('tags') && !empty($request->tags)) {
                $tagIds = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
                $query->whereHas('tags', function ($q) use ($tagIds) {
                    $q->whereIn('tags.id', $tagIds);
                });
            }

            // FILTRE PAR AUTEUR
            if ($request->has('author_id') && !empty($request->author_id)) {
                $query->where('user_id', $request->author_id);
            }

            // FILTRE PAR DATE
            if ($request->has('date') && !empty($request->date)) {
                $query->whereDate('created_at', $request->date);
            }

            // FILTRE PAR TYPE DE FICHIER
            if ($request->has('file_type') && !empty($request->file_type)) {
                $query->where('file_type', $request->file_type);
            }

            // FILTRE PAR STATUT
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            // TRI
            $sortField = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');

            $allowedSortFields = ['created_at', 'title', 'file_size', 'download_count', 'view_count'];
            if (in_array($sortField, $allowedSortFields)) {
                $query->orderBy($sortField, $sortOrder);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $documents = $query->paginate($perPage);

            return response()->json([
                'data' => $documents->items(),
                'meta' => [
                    'current_page' => $documents->currentPage(),
                    'last_page' => $documents->lastPage(),
                    'per_page' => $documents->perPage(),
                    'total' => $documents->total()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur recherche documents', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de la recherche'], 500);
        }
    }

    /**
     * Uploader un nouveau document
     */
    public function store(Request $request)
    {
        Log::info('=== DÉBUT UPLOAD DOCUMENT ===');

        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'file' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,txt',
                'description' => 'nullable|string',
                'tags' => 'nullable|array'
            ]);

            $file = $request->file('file');
            $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('documents', $fileName, 'public');

            $userId = auth()->id();
            if (!$userId) {
                $user = User::first();
                $userId = $user->id;
            }

            $document = Document::create([
                'title' => $request->title,
                'description' => $request->description,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'category_id' => $request->category_id,
                'user_id' => $userId,
                'status' => 'active'
            ]);

            if ($request->has('tags')) {
                $tags = $request->tags;
                $document->tags()->sync($tags);
                foreach ($tags as $tagId) {
                    Tag::find($tagId)?->increment('usage_count');
                }
            }

            return response()->json([
                'message' => 'Document uploadé avec succès',
                'document' => $document->load(['category', 'user', 'tags'])
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erreur upload:', ['message' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de l\'upload'], 500);
        }
    }

    /**
     * Afficher un document spécifique
     */
    public function show(Document $document)
    {
        // Enregistrer la vue
        $this->recordView($document);

        return response()->json([
            'document' => $document->load(['user', 'category', 'tags'])
        ]);
    }

    /**
     * Enregistrer une consultation
     */
    protected function recordView(Document $document)
    {
        try {
            $document->increment('view_count');

            // Si tu as une table document_views
            if (class_exists('App\Models\DocumentView')) {
                \App\Models\DocumentView::create([
                    'document_id' => $document->id,
                    'user_id' => auth()->id(),
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'viewed_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Erreur enregistrement vue:', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Afficher l'historique des consultations
     */
    public function history(Document $document)
    {
        try {
            $user = auth()->user();
            if (!$user->hasRole('admin') && !$user->hasRole('contributor')) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            // Log pour tracer
            Log::info('Consultation historique document', [
                'user_id' => $user->id,
                'document_id' => $document->id,
                'action' => 'view_history'
            ]);

            // Récupérer l'historique si la table existe
            $history = [];
            if (class_exists('App\Models\DocumentView')) {
                $history = \App\Models\DocumentView::with('user')
                    ->where('document_id', $document->id)
                    ->orderBy('viewed_at', 'desc')
                    ->limit(50)
                    ->get()
                    ->map(function ($view) {
                        return [
                            'id' => $view->id,
                            'action' => 'view',
                            'description' => 'Document consulté',
                            'user_name' => $view->user?->name ?? 'Utilisateur inconnu',
                            'created_at' => $view->viewed_at,
                        ];
                    });
            }

            return response()->json(['history' => $history]);
        } catch (\Exception $e) {
            Log::error('Erreur historique:', ['error' => $e->getMessage()]);
            return response()->json(['history' => []], 500);
        }
    }

    /**
     * Afficher un document dans le navigateur (aperçu)
     */
    public function preview(Document $document)
    {
        try {
            if (!auth()->check()) {
                abort(403, 'Non autorisé');
            }

            // Incrémenter le compteur de vues
            $this->recordView($document);

            $filePath = Storage::disk('public')->path($document->file_path);

            if (!file_exists($filePath)) {
                abort(404, 'Fichier non trouvé');
            }

            // Types de fichiers affichables directement
            $viewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt'];

            if (in_array($document->file_type, $viewableTypes)) {
                $mimeTypes = [
                    'pdf' => 'application/pdf',
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'txt' => 'text/plain',
                ];

                $mimeType = $mimeTypes[$document->file_type] ?? 'application/octet-stream';

                return response()->file($filePath, [
                    'Content-Type' => $mimeType,
                    'Content-Disposition' => 'inline; filename="' . $document->file_name . '"',
                ]);
            }

            // Pour les fichiers Office (DOCX, XLSX), on retourne une erreur
            // Le frontend affichera un message
            return response()->json([
                'message' => 'Ce type de fichier ne peut pas être affiché. Veuillez le télécharger.',
                'file_type' => $document->file_type
            ], 415); // 415 = Unsupported Media Type

        } catch (\Exception $e) {
            Log::error('Erreur preview:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de l\'affichage'], 500);
        }
    }

    /**
     * Mettre à jour un document
     */
    public function update(Request $request, Document $document)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin') && $document->user_id !== $user->id) {
            return response()->json(['message' => 'Permission refusée'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|nullable|exists:categories,id',
            'status' => 'sometimes|in:active,archived,draft',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        try {
            $updateData = $request->only(['title', 'description', 'category_id', 'status']);

            if ($user->hasRole('admin') && $request->has('user_id') && !empty($request->user_id)) {
                $updateData['user_id'] = $request->user_id;
            }

            $document->update($updateData);

            if ($request->has('tags')) {
                $tags = $request->tags ?? [];
                $document->tags()->sync($tags);
            }

            return response()->json([
                'message' => 'Document mis à jour avec succès',
                'document' => $document->fresh(['user', 'category', 'tags'])
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur mise à jour:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de la mise à jour'], 500);
        }
    }

    /**
     * Télécharger un document
     */
    public function download(Document $document)
    {
        try {
            $document->increment('download_count');

            // Serve the file directly via Laravel to avoid relying on a public storage symlink.
            return Storage::disk('public')->download(
                $document->file_path,
                $document->file_name,
                ['Content-Type' => $document->mime_type]
            );
        } catch (\Exception $e) {
            Log::error('Erreur téléchargement:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur de téléchargement'], 500);
        }
    }
}
