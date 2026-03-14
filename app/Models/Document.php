<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
class Document extends Model
{
    use HasFactory,SoftDeletes;

      protected $fillable = [
        'title',
        'description',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'mime_type',
        'category_id',
        'user_id',
        'status',
        'view_count',
        'download_count',
        
    ];

    protected $casts = [
        'file_size' => 'integer',

    ];
    //les  Relations
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Get the views for this document.
     */
    public function views()
    {
        return $this->hasMany(DocumentView::class);
    }

    /**
     * Get the users who viewed this document.
     */
    public function viewers()
    {
        return $this->belongsToMany(User::class, 'document_views')
            ->withPivot('action_type', 'viewed_at', 'ip_address', 'user_agent')
            ->orderBy('document_views.viewed_at', 'desc');
    }

    public function getFileUrlAttribute()
    {
        return Storage::url($this->file_path);
    }

    public function getFormattedFileSizeAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}