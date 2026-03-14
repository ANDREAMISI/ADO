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
use Illuminate\Support\Facades\Http;

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
                'email' => 'required|email',
                'company' => 'required|string|max:255',
                'reason' => 'required|string'
            ]);

            // Vérifier si l'utilisateur existe déjà
            $existingUser = User::where('email', $request->email)->first();
            if ($existingUser) {
                if ($existingUser->is_active) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Un compte avec cet email existe déjà et est actif.'
                    ], 422);
                } else {
                    // Utilisateur inactif, vérifier s'il y a déjà une demande en cours
                    $existingRequest = AccessRequest::where('user_id', $existingUser->id)
                        ->where('status', 'pending')
                        ->first();

                    if ($existingRequest) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Une demande d\'accès est déjà en cours pour cet email.'
                        ], 422);
                    }

                    // Créer une nouvelle demande pour l'utilisateur inactif
                    $accessRequest = AccessRequest::create([
                        'name' => $request->name,
                        'email' => $request->email,
                        'company' => $request->company,
                        'reason' => $request->reason,
                        'status' => 'pending',
                        'user_id' => $existingUser->id
                    ]);
                }
            } else {
                // Créer l'utilisateur inactif
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make(Str::random(20)), // Mot de passe temporaire
                    'company' => $request->company,
                    'is_active' => false
                ]);

                // Créer la demande
                $accessRequest = AccessRequest::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'company' => $request->company,
                    'reason' => $request->reason,
                    'status' => 'pending',
                    'user_id' => $user->id
                ]);
            }

            // Envoyer un email à l'admin (notification)
            $this->notifyAdmin($accessRequest ?? $existingRequest);

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
     * Envoyer l'email d'activation via Laravel Mail
     */
    private function sendActivationEmail($user, $password)
    {
        try {
            Log::info('Tentative envoi email d\'activation', ['user' => $user->email]);

            Mail::send([], [], function ($message) use ($user, $password) {
                $message->to($user->email)
                        ->subject('Votre compte Archidoc a été activé')
                        ->html("
                            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                                <h2 style='color: #1901E6;'>Bienvenue sur Archidoc !</h2>
                                <p>Bonjour <strong>{$user->name}</strong>,</p>
                                <p>Votre compte a été activé avec succès. Voici vos identifiants de connexion :</p>
                                <div style='background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                                    <p><strong>Email :</strong> {$user->email}</p>
                                    <p><strong>Mot de passe :</strong> {$password}</p>
                                </div>
                                <p style='color: #dc3545;'><strong>Important :</strong> Changez votre mot de passe après votre première connexion.</p>
                                <div style='text-align: center; margin: 30px 0;'>
                                    <a href='" . url('/login') . "' style='background: #1901E6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>Se connecter</a>
                                </div>
                                <p>Cordialement,<br>L'équipe Archidoc</p>
                            </div>
                        ");
            });

            Log::info('Email d\'activation envoyé avec succès', ['user' => $user->email]);

        } catch (\Exception $e) {
            Log::error('Erreur envoi email d\'activation', [
                'user' => $user->email,
                'error' => $e->getMessage()
            ]);
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
            $user = $accessRequest->user;

            Log::info('Approbation de demande démarrée', [
                'request_id' => $id,
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            // Générer un nouveau mot de passe
            $password = Str::random(10);

            // Activer l'utilisateur et mettre à jour le mot de passe
            $user->update([
                'password' => Hash::make($password),
                'is_active' => true
            ]);

            Log::info('Utilisateur activé', ['user_id' => $user->id, 'email' => $user->email]);

            // Assigner le rôle par défaut
            $user->assignRole('reader');

            // Mettre à jour la demande
            $accessRequest->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => auth()->id()
            ]);

            Log::info('Demande mise à jour', ['request_id' => $id, 'status' => 'approved']);

            // Envoyer l'email à l'utilisateur avec ses identifiants via MailJS
            $this->sendActivationEmail($user, $password);
            Log::info('Approbation terminée avec succès', ['request_id' => $id, 'user_id' => $user->id]);
            return response()->json([
                'success' => true,
                'message' => 'Demande approuvée. Un email a été envoyé à l\'utilisateur.'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'approbation de demande', [
                'request_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'approbation: ' . $e->getMessage()
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
        Log::info('AccessRequestController@index called', [
            'user' => auth()->check() ? auth()->user()->name : 'not authenticated',
            'method' => $request->method(),
            'url' => $request->fullUrl()
        ]);

        try {
            $query = AccessRequest::with('approver', 'user');

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