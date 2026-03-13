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

        // Créer les permissions
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
            Permission::create(['name' => $permission]);
        }

        // Créer les rôles
        $reader = Role::create(['name' => 'reader']);
        $contributor = Role::create(['name' => 'contributor']);
        $admin = Role::create(['name' => 'admin']);

        // Assigner les permissions
        $reader->givePermissionTo(['view documents', 'download documents']);
        
        $contributor->givePermissionTo([
            'view documents', 'create documents', 'edit documents', 
            'delete documents', 'download documents'
        ]);
        
        $admin->givePermissionTo(Permission::all());

        // Créer des utilisateurs de test
        $adminUser = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),  
            'is_active' => true
        ]);
        $adminUser->assignRole('admin');

        $contributorUser = User::create([
            'name' => 'Contributeur',
            'email' => 'contributor@test.com',
            'password' => Hash::make('password'),
            'is_active' => true
        ]);
        $contributorUser->assignRole('contributor');

        $readerUser = User::create([
            'name' => 'Lecteur',
            'email' => 'reader@test.com',
            'password' => Hash::make('password'),
            'is_active' => true
        ]);
        $readerUser->assignRole('reader');

        $this->command->info('Rôles et utilisateurs créés avec succès !');
    }
}