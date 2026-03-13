<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Afficher la liste des utilisateurs
     */
    public function index(Request $request)
    {
        $query = User::with('roles');
        
        // Recherche par tous les champs
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }
        
        // Filtre par rôle
        if ($request->has('role') && !empty($request->role)) {
            $query->whereHas('roles', function($q) use ($request) {
                $q->where('name', $request->role);
            });
        }
        
        // Filtre par statut (is_active)
        if ($request->has('is_active') && $request->is_active !== '' && $request->is_active !== null) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === true);
        }
        
        // Filtre par date de création
        if ($request->has('date_from') && !empty($request->date_from)) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to') && !empty($request->date_to)) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        
        // Tri
        $sortField = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSortFields = ['created_at', 'name', 'email', 'is_active'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortOrder);
        }
        
        $users = $query->paginate(10);
        
        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total()
            ]
        ]);
    }

    /**
     * Récupérer tous les utilisateurs (pour les selects)
     */
    public function list()
    {
        $users = User::select('id', 'name', 'email', 'is_active')->get();
        return response()->json(['data' => $users]);
    }

    /**
     * Afficher les détails d'un utilisateur
     */
    public function show(User $user)
    {
        $user->load('roles');
        return response()->json(['user' => $user]);
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name',
            'is_active' => 'boolean'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => $request->is_active ?? true
        ]);

        // Assigner le rôle
        $user->assignRole($request->role);

        Log::info('Utilisateur créé par admin', [
            'admin_id' => auth()->id(),
            'new_user_id' => $user->id,
            'role' => $request->role
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user->load('roles')
        ], 201);
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|exists:roles,name',
            'is_active' => 'sometimes|boolean'
        ]);

        $data = $request->only(['name', 'email', 'is_active']);
        
        if ($request->has('password') && !empty($request->password)) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        // Mettre à jour le rôle si fourni
        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        Log::info('Utilisateur modifié par admin', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id
        ]);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user->load('roles')
        ]);
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy(User $user)
    {
        // Empêcher la suppression de son propre compte
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte'
            ], 403);
        }

        $user->delete();

        Log::info('Utilisateur supprimé par admin', [
            'admin_id' => auth()->id(),
            'deleted_user_id' => $user->id
        ]);

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    /**
     * Activer/Désactiver un utilisateur
     */
    public function toggleActive(User $user)
    {
        // Empêcher la désactivation de son propre compte
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier votre propre statut'
            ], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        Log::info('Statut utilisateur modifié par admin', [
            'admin_id' => auth()->id(),
            'user_id' => $user->id,
            'new_status' => $user->is_active
        ]);

        return response()->json([
            'message' => $user->is_active ? 'Compte activé' : 'Compte désactivé',
            'is_active' => $user->is_active
        ]);
    }

    /**
     * Récupérer les rôles disponibles
     */
    public function roles()
    {
        $roles = Role::all()->pluck('name');
        return response()->json(['roles' => $roles]);
    }
}