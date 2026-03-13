<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentView extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'user_id',
        'viewed_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    /**
     * Get the document that was viewed.
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /**
     * Get the user who viewed the document.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

