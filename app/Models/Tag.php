<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'color', 'usage_count', 'user_id'];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
            // Assigner l'utilisateur connecté lors de la création
            if (empty($tag->user_id) && auth()->check()) {
                $tag->user_id = auth()->id();
            }
        });
    }

    public function documents()
    {
        return $this->belongsToMany(Document::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
