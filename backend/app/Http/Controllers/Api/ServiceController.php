<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    /**
     * Listar servicios (público: solo activos, admin: todos)
     */
    public function index(Request $request)
    {
        $query = Service::query();

        if (!$request->user()) {
            $query->active();
        }

        $services = $query->orderBy('sort_order')->orderBy('name')->get();

        return response()->json($services);
    }

    /**
     * Ver un servicio
     */
    public function show(Service $service)
    {
        return response()->json($service);
    }

    /**
     * Crear servicio (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:15',
            'image' => 'nullable|image|max:10240',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        $service = Service::create($validated);

        return response()->json($service, 201);
    }

    /**
     * Actualizar servicio (admin)
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration_minutes' => 'sometimes|required|integer|min:15',
            'image' => 'nullable|image|max:10240',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        // Handle image deletion flag
        if ($request->input('delete_image') == 1) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $service->image = null;
        }

        if ($request->hasFile('image')) {
            // Eliminar imagen anterior
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $service->image = $request->file('image')->store('services', 'public');
        }

        $service->fill($validated);
        $service->save();

        return response()->json($service);
    }

    /**
     * Eliminar servicio (admin)
     */
    public function destroy(Service $service)
    {
        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();

        return response()->json(['message' => 'Servicio eliminado correctamente.']);
    }
}
