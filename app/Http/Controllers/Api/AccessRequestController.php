<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccessRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AccessRequestController extends Controller
{
    /**
     * Soumettre une demande d'accès (publique)
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email|unique:access_requests,email',
                'company' => 'required|string|max:255',
                'reason' => 'required|string'
            ]);

            // Créer la demande
            $accessRequest = AccessRequest::create([
                'name' => $request->name,
                'email' => $request->email,
                'company' => $request->company,
                'reason' => $request->reason,
                'status' => 'pending'
            ]);

            // Envoyer un email à l'admin (notification)
            $this->notifyAdmin($accessRequest);

            return response()->json([
                'success' => true,
                'message' => 'Votre demande a été envoyée avec succès. Vous recevrez un email de confirmation après validation.'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur soumission demande:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue. Veuillez réessayer.'
            ], 500);
        }
    }

    /**
     * Notifier l'admin par email
     */
    private function notifyAdmin($accessRequest)
    {
        try {
            $admins = User::whereHas('roles', function($q) {
                $q->where('name', 'admin');
            })->get();

            foreach ($admins as $admin) {
                Mail::send('emails.access-request-notification', [
                    'request' => $accessRequest,
                    'admin' => $admin
                ], function ($message) use ($admin) {
                    $message->to($admin->email)
                            ->subject('Nouvelle demande d\'accès - Archidoc');
                });
            }
        } catch (\Exception $e) {
            Log::error('Erreur envoi email admin:', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Approuver une demande (admin)
     */
    public function approve(Request $request, $id)
    {
        try {
            $accessRequest = AccessRequest::findOrFail($id);

            // Générer un mot de passe aléatoire
            $password = Str::random(10);

            // Créer l'utilisateur
            $user = User::create([
                'name' => $accessRequest->name,
                'email' => $accessRequest->email,
                'password' => Hash::make($password),
                'company' => $accessRequest->company,
                'role' => 'reader', // Rôle par défaut
                'is_active' => true
            ]);

            // Mettre à jour la demande
            $accessRequest->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => auth()->id()
            ]);

            // Envoyer l'email à l'utilisateur avec ses identifiants
            Mail::send('emails.access-request-approved', [
                'user' => $user,
                'password' => $password
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Votre compte Archidoc a été créé');
            });

            return response()->json([
                'success' => true,
                'message' => 'Demande approuvée. Un email a été envoyé à l\'utilisateur.'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur approbation demande:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation'
            ], 500);
        }
    }

    /**
     * Rejeter une demande (admin)
     */
    public function reject(Request $request, $id)
    {
        try {
            $accessRequest = AccessRequest::findOrFail($id);

            $accessRequest->update([
                'status' => 'rejected',
                'admin_notes' => $request->notes
            ]);

            // Optionnel : envoyer un email de rejet
            Mail::send('emails.access-request-rejected', [
                'request' => $accessRequest,
                'notes' => $request->notes
            ], function ($message) use ($accessRequest) {
                $message->to($accessRequest->email)
                        ->subject('Votre demande d\'accès à Archidoc');
            });

            return response()->json([
                'success' => true,
                'message' => 'Demande rejetée'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur rejet demande:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rejet'
            ], 500);
        }
    }

    /**
     * Lister les demandes (admin)
     */
    public function index(Request $request)
    {
        try {
            $query = AccessRequest::with('approver');

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $requests = $query->orderBy('created_at', 'desc')->paginate(15);

            return response()->json([
                'data' => $requests->items(),
                'meta' => [
                    'current_page' => $requests->currentPage(),
                    'last_page' => $requests->lastPage(),
                    'total' => $requests->total()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur chargement demandes:', ['error' => $e->getMessage()]);
            return response()->json(['data' => [], 'meta' => []], 500);
        }
    }
}