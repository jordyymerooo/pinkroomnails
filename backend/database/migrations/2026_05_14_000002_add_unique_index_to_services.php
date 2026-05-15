<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Agrega un índice único en services.name para prevenir duplicados.
     * Si ya hay duplicados, los elimina antes de crear el índice.
     */
    public function up(): void
    {
        // Eliminar duplicados conservando solo el registro más antiguo (id menor)
        DB::statement("
            DELETE FROM services
            WHERE id NOT IN (
                SELECT MIN(id)
                FROM services
                GROUP BY name, category
            )
        ");

        // Agregar índice único compuesto en (name, category)
        Schema::table('services', function (Blueprint $table) {
            $table->unique(['name', 'category'], 'services_name_category_unique');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropUnique('services_name_category_unique');
        });
    }
};
