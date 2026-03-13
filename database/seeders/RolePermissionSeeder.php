<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Réinitialiser le cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Créer les permissions (éviter les doublons)
        $permissions = [
            'view documents',
            'create documents',
            'edit documents',
            'delete documents',
            'download documents',
            'manage categories',
            'manage tags',
            'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Créer les rôles
        $reader = Role::firstOrCreate(['name' => 'reader']);
        $contributor = Role::firstOrCreate(['name' => 'contributor']);
        $admin = Role::firstOrCreate(['name' => 'admin']);

        // Assigner les permissions
        $reader->givePermissionTo(['view documents', 'download documents']);
        
        $contributor->givePermissionTo([
            'view documents', 'create documents', 'edit documents', 
            'delete documents', 'download documents'
        ]);
        
        $admin->givePermissionTo(Permission::all());

        // Créer des utilisateurs de test
        $adminUser = User::firstOrCreate([
            'email' => 'admin@test.com'
        ], [
            'name' => 'Admin',
            'password' => Hash::make('password'),  
            'is_active' => true
        ]);
        $adminUser->assignRole('admin');

        $contributorUser = User::firstOrCreate([
            'email' => 'contributor@test.com'
        ], [
            'name' => 'Contributeur',
            'password' => Hash::make('password'),
            'is_active' => true
        ]);
        $contributorUser->assignRole('contributor');

        $readerUser = User::firstOrCreate([
            'email' => 'reader@test.com'
        ], [
            'name' => 'Lecteur',
            'password' => Hash::make('password'),
            'is_active' => true
        ]);
        $readerUser->assignRole('reader');

        $this->command->info('Rôles et utilisateurs créés avec succès !');
    }
}