<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'company',
        'reason',
        'status',
        'admin_notes',
        'approved_at',
        'approved_by'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
        ];

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}