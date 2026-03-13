<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('file_size');
            $table->string('mime_type');
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            // $table->foreignId('category_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->integer('download_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};