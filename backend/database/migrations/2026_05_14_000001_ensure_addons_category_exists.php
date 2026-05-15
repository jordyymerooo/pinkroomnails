<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Garantiza que la categoría protegida "Add-ons" siempre exista.
     * Esta migración es idempotente: no falla si ya existe.
     */
    public function up(): void
    {
        DB::table('categories')->updateOrInsert(
            ['name' => 'Add-ons'],
            [
                'name'        => 'Add-ons',
                'description' => 'Additional services and enhancements to complement your treatment.',
                'is_active'   => true,
                'sort_order'  => 0,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]
        );
    }

    /**
     * No se elimina la categoría protegida al hacer rollback.
     */
    public function down(): void
    {
        // Protegida — no se elimina en rollback
    }
};
