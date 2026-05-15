<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Inserta los 7 días de la semana en la tabla schedules si no existen.
     * Lunes-Viernes: 9:00-19:00 abiertos.
     * Sábado: 9:00-14:00 abierto.
     * Domingo: cerrado.
     */
    public function up(): void
    {
        $defaults = [
            ['day_of_week' => 0, 'start_time' => '00:00', 'end_time' => '00:00', 'is_active' => false],  // Domingo
            ['day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],   // Lunes
            ['day_of_week' => 2, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],   // Martes
            ['day_of_week' => 3, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],   // Miércoles
            ['day_of_week' => 4, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],   // Jueves
            ['day_of_week' => 5, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],   // Viernes
            ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '14:00', 'is_active' => true],   // Sábado
        ];

        foreach ($defaults as $day) {
            DB::table('schedules')->updateOrInsert(
                ['day_of_week' => $day['day_of_week']],
                array_merge($day, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }

    public function down(): void
    {
        // No borrar horarios en rollback — son datos operativos
    }
};
