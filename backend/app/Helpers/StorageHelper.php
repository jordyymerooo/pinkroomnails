<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class StorageHelper
{
    /**
     * Devuelve el nombre del disco activo según el entorno.
     * - En producción (Railway): usa Supabase Storage si está configurado
     * - En local: usa el disco 'public' estándar de Laravel
     */
    public static function disk(): string
    {
        return env('FILESYSTEM_DISK', 'public');
    }

    /**
     * Guarda un archivo y devuelve su path relativo.
     */
    public static function store($file, string $folder): string
    {
        $disk = self::disk();

        if ($disk === 'supabase') {
            $secret = env('SUPABASE_STORAGE_SECRET');
            $storageUrl = env('SUPABASE_STORAGE_URL');
            
            // Si faltan las variables de Supabase, hacemos fallback a public inmediatamente
            if (!empty($secret) && !empty($storageUrl)) {
                try {
                    $filename = uniqid() . '_' . $file->getClientOriginalName();
                    $path = $folder . '/' . $filename;
                    
                    $baseUrl = str_replace('/object/public', '', $storageUrl);
                    $uploadUrl = rtrim($baseUrl, '/') . '/object/images/' . $path;
                    
                    $response = \Illuminate\Support\Facades\Http::withHeaders([
                        'Authorization' => 'Bearer ' . $secret,
                        'Content-Type'  => $file->getMimeType(),
                    ])->send('POST', $uploadUrl, [
                        'body' => file_get_contents($file->getRealPath())
                    ]);

                    if ($response->successful()) {
                        return $path;
                    }
                    
                    \Illuminate\Support\Facades\Log::error('Supabase upload failed: ' . $response->body());
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Supabase upload exception: ' . $e->getMessage());
                }
            } else {
                \Illuminate\Support\Facades\Log::warning('Supabase variables missing. Falling back to public disk.');
            }
        }

        return $file->store($folder, 'public');
    }

    /**
     * Elimina un archivo por su path relativo.
     */
    public static function delete(?string $path): void
    {
        if (!$path) return;

        $disk = self::disk();
        
        if ($disk === 'supabase') {
            $baseUrl = str_replace('/object/public', '', env('SUPABASE_STORAGE_URL'));
            $deleteUrl = rtrim($baseUrl, '/') . '/object/images/' . $path;
            
            \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . env('SUPABASE_STORAGE_SECRET'),
            ])->delete($deleteUrl);
            return;
        }

        Storage::disk('public')->delete($path);
    }

    /**
     * Devuelve la URL pública de un archivo.
     */
    public static function url(string $path): string
    {
        if (!$path) return '';
        
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        
        $disk = self::disk();

        if ($disk === 'supabase') {
            $publicUrl = env('SUPABASE_STORAGE_URL');
            return rtrim($publicUrl, '/') . '/images/' . $path;
        }

        return Storage::disk('public')->url($path);
    }
}
