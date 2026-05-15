<?php

namespace App\Http\Controllers\Api;

use App\Helpers\StorageHelper;
use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\Request;

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

        // Enriquecer con URL pública correcta según entorno
        $images = $images->map(function ($img) {
            $img->full_url = $img->image_path ? StorageHelper::url($img->image_path) : null;
            return $img;
        });

        return response()->json($images);
    }

    /**
     * Subir imagen a la galería (admin)
     */
    public function store(Request $request)
    {
        // Normalizar booleano de FormData
        $request->merge([
            'is_featured' => filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
        ]);

        $validated = $request->validate([
            'title'      => 'nullable|string|max:255',
            'image'      => 'required|image|max:5120',
            'category'   => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $path = StorageHelper::store($request->file('image'), 'gallery');

        $image = GalleryImage::create([
            'title'      => $validated['title'] ?? null,
            'image_path' => $path,
            'category'   => $validated['category'] ?? 'general',
            'is_featured' => $validated['is_featured'] ?? false,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        $image->full_url = StorageHelper::url($path);

        return response()->json($image, 201);
    }

    /**
     * Actualizar imagen (admin)
     */
    public function update(Request $request, GalleryImage $gallery)
    {
        $validated = $request->validate([
            'title'      => 'nullable|string|max:255',
            'category'   => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $gallery->update($validated);
        $gallery->full_url = $gallery->image_path ? StorageHelper::url($gallery->image_path) : null;

        return response()->json($gallery);
    }

    /**
     * Eliminar imagen (admin)
     */
    public function destroy(GalleryImage $gallery)
    {
        StorageHelper::delete($gallery->image_path);
        $gallery->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente.']);
    }
}
