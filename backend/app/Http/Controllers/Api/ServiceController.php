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
     * Crear servicio (admin).
     * 
     * El frontend envía FormData, por lo que todos los valores llegan
     * como strings ("1"/"0" para booleanos). Se normalizan antes de validar.
     */
    public function store(Request $request)
    {
        // ─── Normalizar booleanos que vienen de FormData como strings ───
        $request->merge([
            'is_active' => filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'price'            => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'image'            => 'nullable|image|max:10240',
            'category'         => 'nullable|string|max:100',
            'is_active'        => 'boolean',
            'sort_order'       => 'nullable|integer',
        ]);

        // Verificar duplicado por nombre + categoría antes de insertar
        $categoryValue = $validated['category'] ?? 'general';
        $exists = Service::where('name', $validated['name'])
            ->where('category', $categoryValue)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'A service with this name already exists in this category.',
                'errors'  => ['name' => ['A service with this name already exists in this category.']],
            ], 422);
        }

        // Asignar sort_order automático si no viene
        if (empty($validated['sort_order'])) {
            $validated['sort_order'] = (Service::max('sort_order') ?? 0) + 1;
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        $service = Service::create($validated);

        return response()->json($service, 201);
    }

    /**
     * Actualizar servicio (admin).
     * Se expone como POST en lugar de PUT/PATCH para soportar FormData con imagen.
     */
    public function update(Request $request, Service $service)
    {
        // ─── Normalizar booleanos que vienen de FormData como strings ───
        if ($request->has('is_active')) {
            $request->merge([
                'is_active' => filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        $validated = $request->validate([
            'name'             => 'sometimes|required|string|max:255',
            'description'      => 'nullable|string',
            'price'            => 'sometimes|required|numeric|min:0',
            'duration_minutes' => 'sometimes|required|integer|min:1',
            'image'            => 'nullable|image|max:10240',
            'category'         => 'nullable|string|max:100',
            'is_active'        => 'sometimes|boolean',
            'sort_order'       => 'nullable|integer',
        ]);

        // Eliminar imagen si se solicitó
        if ($request->input('delete_image') == 1) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $service->image = null;
        }

        // Reemplazar imagen si viene una nueva
        if ($request->hasFile('image')) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = $request->file('image')->store('services', 'public');
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
