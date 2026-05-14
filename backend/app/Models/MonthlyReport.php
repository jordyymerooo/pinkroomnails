<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyReport extends Model
{
    protected $fillable = [
        'month',
        'year',
        'total_revenue',
        'total_appointments',
    ];
}
