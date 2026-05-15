<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Devuelve todas las categorías ordenadas por sort_order.
     */
    public function index()
    {
        return response()->json(Category::orderBy('sort_order')->get());
    }

    /**
     * Crea una nueva categoría.
     * Garantiza además que "Add-ons" siempre exista (red de seguridad).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'is_active'   => 'nullable|in:0,1,true,false',
        ]);

        // Normalizar is_active
        $validated['is_active'] = filter_var($validated['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN);

        $category = Category::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active'   => $validated['is_active'],
            'sort_order'  => (Category::max('sort_order') ?? 0) + 1,
        ]);

        // Asegurar que Add-ons existe siempre
        Category::firstOrCreate(
            ['name' => 'Add-ons'],
            [
                'description' => 'Additional services and enhancements to complement your treatment.',
                'is_active'   => true,
                'sort_order'  => 0,
            ]
        );

        return response()->json($category, 201);
    }

    /**
     * Actualiza una categoría existente.
     * Protege "Add-ons" de cambio de nombre.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'is_active'   => 'nullable|in:0,1,true,false',
            'sort_order'  => 'nullable|integer',
        ]);

        // Normalizar is_active
        if (array_key_exists('is_active', $validated)) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        // Proteger nombre de Add-ons
        if (strtolower($category->name) === 'add-ons' && isset($validated['name']) && strtolower($validated['name']) !== 'add-ons') {
            return response()->json(['message' => 'The "Add-ons" category name is protected and cannot be changed.'], 403);
        }

        // Si el nombre cambió, sincronizar los servicios que usan el nombre anterior
        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            Service::where('category', $category->name)->update(['category' => $validated['name']]);
        }

        $category->update($validated);

        return response()->json($category);
    }

    /**
     * Elimina una categoría y sus servicios.
     * "Add-ons" está protegida y nunca se puede eliminar.
     */
    public function destroy(Category $category)
    {
        // 🔒 Categoría protegida — no se puede eliminar
        if (strtolower($category->name) === 'add-ons') {
            return response()->json([
                'message' => 'The "Add-ons" category is protected and cannot be deleted.',
            ], 403);
        }

        // Eliminar los servicios asociados y sus imágenes
        $services = Service::where('category', $category->name)->get();

        foreach ($services as $service) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $service->delete();
        }

        $category->delete();

        return response()->json(null, 204);
    }
}
