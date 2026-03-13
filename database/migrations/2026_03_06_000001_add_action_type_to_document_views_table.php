<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('document_views', function (Blueprint $table) {
            // Vérifier si la colonne n'existe pas avant de l'ajouter
            if (!Schema::hasColumn('document_views', 'action_type')) {
                $table->enum('action_type', ['view', 'download'])->after('user_id')->default('view');
            }
        });
    }

    public function down()
    {
        Schema::table('document_views', function (Blueprint $table) {
            if (Schema::hasColumn('document_views', 'action_type')) {
                $table->dropColumn('action_type');
            }
        });
    }
};
