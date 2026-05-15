<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Devuelve todas las categorías ordenadas.
     * Garantiza que "Add-ons" siempre exista (red de seguridad en runtime).
     */
    public function index()
    {
        // Red de seguridad: si "Add-ons" no existe en la DB, la crea automáticamente
        Category::firstOrCreate(
            ['name' => 'Add-ons'],
            [
                'description' => 'Additional services and enhancements to complement your treatment.',
                'is_active'   => true,
                'sort_order'  => 0,
            ]
        );

        return Category::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $category = Category::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active'   => $validated['is_active'] ?? true,
            'sort_order'  => Category::max('sort_order') + 1,
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
            'sort_order'  => 'integer',
        ]);

        // Si cambia el nombre, sincroniza los servicios que usan ese nombre de categoría
        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            Service::where('category', $category->name)->update(['category' => $validated['name']]);
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        // 🔒 Categoría protegida — no se puede eliminar
        if (strtolower($category->name) === 'add-ons') {
            return response()->json([
                'message' => 'The "Add-ons" category is protected and cannot be deleted.',
            ], 403);
        }

        // Elimina los servicios asociados junto con sus imágenes
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
