<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\MonthlyReport;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Estadísticas del dashboard (admin)
     */
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // Citas del mes
        $monthlyAppointments = Appointment::whereBetween('appointment_date', [$startOfMonth, $endOfMonth])->count();

        // Citas pendientes
        $pendingAppointments = Appointment::where('status', 'pending')->count();

        // Ingresos estimados del mes (citas confirmadas + completadas)
        $monthlyRevenue = Appointment::whereBetween('appointment_date', [$startOfMonth, $endOfMonth])
            ->whereIn('status', ['confirmed', 'completed'])
            ->join('services', 'appointments.service_id', '=', 'services.id')
            ->sum('services.price');

        // Servicio más popular
        $popularService = Service::withCount(['appointments' => function ($query) use ($startOfMonth, $endOfMonth) {
            $query->whereBetween('appointment_date', [$startOfMonth, $endOfMonth]);
        }])->orderBy('appointments_count', 'desc')->first();

        // Citas por semana (últimas 8 semanas)
        $weeklyData = [];
        for ($i = 7; $i >= 0; $i--) {
            $weekStart = $now->copy()->subWeeks($i)->startOfWeek();
            $weekEnd = $weekStart->copy()->endOfWeek();
            $count = Appointment::whereBetween('appointment_date', [$weekStart, $weekEnd])
                ->whereNotIn('status', ['cancelled'])
                ->count();
            $weeklyData[] = [
                'week' => $weekStart->format('d M'),
                'citas' => $count,
            ];
        }

        // Ingresos y Citas por mes (Historial desde monthly_reports)
        $history = MonthlyReport::orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get()
            ->reverse();

        $monthlyHistoryData = [];
        foreach ($history as $report) {
            $monthName = Carbon::createFromDate($report->year, $report->month, 1)->translatedFormat('M Y');
            $monthlyHistoryData[] = [
                'month' => $monthName,
                'ingresos' => (float) $report->total_revenue,
                'citas' => $report->total_appointments,
            ];
        }

        // Citas recientes
        $recentAppointments = Appointment::with('service')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'monthly_appointments' => $monthlyAppointments,
                'pending_appointments' => $pendingAppointments,
                'monthly_revenue' => round($monthlyRevenue, 2),
                'popular_service' => $popularService ? $popularService->name : 'N/A',
            ],
            'charts' => [
                'weekly_appointments' => $weeklyData,
                'monthly_history' => $monthlyHistoryData,
            ],
            'recent_appointments' => $recentAppointments,
        ]);
    }
}
