<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CloseMonthCommand extends Command
{
    protected $signature = 'app:close-month';
    protected $description = 'Cierra el mes anterior calculando ingresos y citas totales para el reporte histórico.';

    public function handle()
    {
        // Forzar zona horaria New York para obtener el mes correcto
        $lastMonth = \Carbon\Carbon::now('America/New_York')->subMonth();
        $month = $lastMonth->month;
        $year = $lastMonth->year;

        $this->info("Calculando reporte para: {$lastMonth->translatedFormat('F Y')}");

        $startOfMonth = $lastMonth->copy()->startOfMonth();
        $endOfMonth = $lastMonth->copy()->endOfMonth();

        // 1. Contar citas completadas del mes pasado
        $totalAppointments = \App\Models\Appointment::whereBetween('appointment_date', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->count();

        // 2. Sumar ingresos (precio de los servicios de citas completadas)
        $totalRevenue = \App\Models\Appointment::whereBetween('appointment_date', [$startOfMonth, $endOfMonth])
            ->where('status', 'completed')
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->sum('services.price');

        // 3. Crear o actualizar el reporte histórico
        \App\Models\MonthlyReport::updateOrCreate(
            ['month' => $month, 'year' => $year],
            [
                'total_revenue' => $totalRevenue,
                'total_appointments' => $totalAppointments,
            ]
        );

        $this->info("¡Cierre de mes exitoso! Ingresos: $" . number_format($totalRevenue, 2) . " - Citas: $totalAppointments");
    }
}
