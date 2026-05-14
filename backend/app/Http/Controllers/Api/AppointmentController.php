<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    /**
     * Listar citas (admin)
     */
    public function index(Request $request)
    {
        $query = Appointment::with('service');

        // Filtros opcionales
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('appointment_date', [$request->from, $request->to]);
        }

        $appointments = $query->orderBy('appointment_date', 'desc')
                              ->orderBy('appointment_time', 'desc')
                              ->paginate(20);

        return response()->json($appointments);
    }

    /**
     * Crear cita (público)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string|max:500',
        ]);

        return DB::transaction(function () use ($validated) {
            $date = Carbon::parse($validated['appointment_date']);
            $dayOfWeek = $date->dayOfWeek;

            // 1. Pessimistic Locking: Bloqueamos la fila del horario para este día.
            // Esto evita que dos solicitudes concurrentes para la misma fecha se crucen.
            $schedule = Schedule::where('day_of_week', $dayOfWeek)
                ->active()
                ->lockForUpdate()
                ->first();

            if (!$schedule) {
                return response()->json([
                    'message' => 'No hay atención disponible para el día seleccionado.',
                ], 422);
            }

            // 2. Obtener duración del servicio solicitado
            $service = Service::findOrFail($validated['service_id']);
            $startTime = Carbon::parse($validated['appointment_time']);
            $endTime = (clone $startTime)->addMinutes($service->duration_minutes);

            // 3. Validar solapamiento con citas existentes (Considerando Duración)
            // Lógica de traslape: (InicioA < FinB) AND (FinA > InicioB)
            $existingAppointments = Appointment::where('appointment_date', $validated['appointment_date'])
                ->whereNotIn('status', ['cancelled'])
                ->with('service')
                ->get();

            foreach ($existingAppointments as $appt) {
                $apptStart = Carbon::parse($appt->appointment_time);
                $apptDuration = $appt->service ? $appt->service->duration_minutes : 60;
                $apptEnd = (clone $apptStart)->addMinutes($apptDuration);

                if ($startTime < $apptEnd && $endTime > $apptStart) {
                    return response()->json([
                        'message' => 'Lo sentimos, este horario se acaba de ocupar. Por favor selecciona otro.',
                    ], 422);
                }
            }

            // 4. Verificar que la hora está dentro del horario de atención (incluyendo fin del servicio)
            $schStart = Carbon::parse($schedule->start_time);
            $schEnd = Carbon::parse($schedule->end_time);
            
            if ($startTime < $schStart || $endTime > $schEnd) {
                return response()->json([
                    'message' => 'El horario seleccionado (incluyendo la duración del servicio) está fuera del horario de atención.',
                ], 422);
            }

            // 5. Registrar la cita
            $validated['status'] = 'pending';
            $appointment = Appointment::create($validated);
            $appointment->load('service');

            return response()->json([
                'message' => '¡Cita reservada exitosamente! Te confirmaremos pronto.',
                'appointment' => $appointment,
            ], 201);
        });
    }

    /**
     * Crear cita (admin)
     * Permite agendar sin restricciones estrictas de horario
     */
    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string|max:500',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
        ]);

        if (!isset($validated['status'])) {
            $validated['status'] = 'confirmed'; // Admin creates confirmed by default
        }

        $appointment = Appointment::create($validated);
        $appointment->load('service');

        return response()->json([
            'message' => 'Cita creada exitosamente.',
            'appointment' => $appointment,
        ], 201);
    }

    /**
     * Ver una cita (admin)
     */
    public function show(Appointment $appointment)
    {
        $appointment->load('service');
        return response()->json($appointment);
    }

    /**
     * Actualizar estado de cita (admin)
     */
    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string|max:500',
            'service_id' => 'sometimes|exists:services,id',
            'appointment_date' => 'sometimes|date',
            'appointment_time' => 'sometimes|date_format:H:i:s,H:i',
            'client_name' => 'sometimes|string|max:255',
            'client_phone' => 'sometimes|string|max:20',
        ]);

        $appointment->update($validated);
        $appointment->load('service');

        return response()->json([
            'message' => 'Cita actualizada correctamente.',
            'appointment' => $appointment,
        ]);
    }

    /**
     * Eliminar cita (admin)
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json(['message' => 'Cita eliminada correctamente.']);
    }

    public function availableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'service_id' => 'nullable|exists:services,id',
        ]);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek;

        // Obtener horario del día
        $schedule = Schedule::where('day_of_week', $dayOfWeek)->active()->first();

        if (!$schedule) {
            return response()->json([
                'available' => false,
                'message' => 'No hay atención este día.',
                'slots' => [],
            ]);
        }

        $requestedServiceDuration = 30; // default fallback
        if ($request->filled('service_id')) {
            $service = \App\Models\Service::find($request->service_id);
            if ($service) {
                $requestedServiceDuration = $service->duration_minutes;
            }
        }

        // Generar todos los slots de 30 minutos
        $startTime = Carbon::parse($schedule->start_time);
        $endTime = Carbon::parse($schedule->end_time);
        $slots = [];

        while ($startTime < $endTime) {
            $slots[] = $startTime->format('H:i');
            $startTime->addMinutes(30);
        }

        // Obtener citas existentes para esa fecha (no canceladas)
        $bookedAppointments = Appointment::with('service')
            ->where('appointment_date', $date->toDateString())
            ->whereNotIn('status', ['cancelled'])
            ->get();

        $bookedIntervals = [];
        foreach ($bookedAppointments as $appt) {
            $start = Carbon::parse($appt->appointment_time);
            $duration = $appt->service ? $appt->service->duration_minutes : 60;
            $end = $start->copy()->addMinutes($duration);
            $bookedIntervals[] = [
                'start' => $start,
                'end' => $end
            ];
        }

        // Si es hoy, filtrar horas pasadas
        $now = Carbon::now();
        $isToday = $date->isToday();

        // Marcar disponibilidad
        $availableSlots = [];
        foreach ($slots as $slotTime) {
            $slotStart = Carbon::parse($slotTime);
            $slotEnd = $slotStart->copy()->addMinutes($requestedServiceDuration);
            
            // 1. Filtrar horas pasadas (no las mostramos)
            if ($isToday && $slotStart <= $now) {
                continue; 
            }
            
            // 2. Validar que el servicio termine antes de la hora de cierre
            if ($slotEnd > $endTime) {
                $available = false;
            } else {
                $available = true;
                // 3. Validar solapamientos con citas existentes
                foreach ($bookedIntervals as $interval) {
                    // Solapamiento: (InicioA < FinB) AND (FinA > InicioB)
                    if ($slotStart < $interval['end'] && $slotEnd > $interval['start']) {
                        $available = false;
                        break;
                    }
                }
            }

            $availableSlots[] = [
                'time' => $slotTime,
                'available' => $available,
            ];
        }

        return response()->json([
            'available' => true,
            'date' => $date->toDateString(),
            'schedule' => [
                'start' => $schedule->start_time,
                'end' => $schedule->end_time,
            ],
            'slots' => array_values($availableSlots),
        ]);
    }
}
