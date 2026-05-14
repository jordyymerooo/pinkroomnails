<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Listar imágenes de galería
     */
    public function index(Request $request)
    {
        $query = GalleryImage::query();

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $images = $query->orderBy('sort_order')->orderBy('created_at', 'desc')->get();

        return response()->json($images);
    }

    /**
     * Subir imagen a la galería (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|max:5120',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        $image = GalleryImage::create([
            'title' => $validated['title'] ?? null,
            'image_path' => $path,
            'category' => $validated['category'] ?? 'general',
            'is_featured' => $validated['is_featured'] ?? false,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json($image, 201);
    }

    /**
     * Actualizar imagen (admin)
     */
    public function update(Request $request, GalleryImage $gallery)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $gallery->update($validated);

        return response()->json($gallery);
    }

    /**
     * Eliminar imagen (admin)
     */
    public function destroy(GalleryImage $gallery)
    {
        Storage::disk('public')->delete($gallery->image_path);
        $gallery->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente.']);
    }
}
