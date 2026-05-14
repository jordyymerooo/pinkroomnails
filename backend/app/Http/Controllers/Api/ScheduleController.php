<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Listar horarios
     */
    public function index()
    {
        $schedules = Schedule::orderBy('day_of_week')->get()->map(function ($schedule) {
            return [
                'id' => $schedule->id,
                'day_of_week' => $schedule->day_of_week,
                'day_name' => $schedule->day_name,
                'start_time' => $schedule->start_time,
                'end_time' => $schedule->end_time,
                'is_active' => $schedule->is_active,
            ];
        });

        return response()->json($schedules);
    }

    /**
     * Actualizar horario (admin)
     */
    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'is_active' => 'boolean',
        ]);

        $schedule->update($validated);

        return response()->json([
            'message' => 'Horario actualizado correctamente.',
            'schedule' => $schedule,
        ]);
    }

    /**
     * Actualizar todos los horarios (admin)
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'schedules' => 'required|array',
            'schedules.*.id' => 'required|exists:schedules,id',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i',
            'schedules.*.is_active' => 'required|boolean',
        ]);

        foreach ($validated['schedules'] as $data) {
            Schedule::where('id', $data['id'])->update([
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'is_active' => $data['is_active'],
            ]);
        }

        return response()->json([
            'message' => 'Horarios actualizados correctamente.',
        ]);
    }
}
