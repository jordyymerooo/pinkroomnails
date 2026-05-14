<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => Category::max('sort_order') + 1,
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        // If name changes, update services
        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            Service::where('category', $category->name)->update(['category' => $validated['name']]);
        }

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        // Protect the 'Add-ons' category from deletion
        if (strtolower($category->name) === 'add-ons') {
            return response()->json(['message' => 'The "Add-ons" category is protected and cannot be deleted.'], 403);
        }

        // Find all services in this category
        $services = Service::where('category', $category->name)->get();

        foreach ($services as $service) {
            // Delete service image from disk
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            // Delete the service record
            $service->delete();
        }

        // Finally delete the category
        $category->delete();

        return response()->json(null, 204);
    }
}
