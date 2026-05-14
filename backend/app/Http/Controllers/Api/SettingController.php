<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Obtener todas las configuraciones públicas
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json($settings);
    }

    /**
     * Actualizar configuraciones (admin)
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json([
            'message' => 'Configuraciones actualizadas correctamente.',
        ]);
    }
}
