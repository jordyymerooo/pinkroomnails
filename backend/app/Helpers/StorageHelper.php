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
            // Utilizamos el driver S3 configurado en filesystems.php
            // El usuario tiene credenciales S3 válidas, por lo que storePublicly funcionará.
            try {
                return $file->storePublicly($folder, ['disk' => 'supabase']);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('S3 upload exception: ' . $e->getMessage());
                // Fallback a public si la subida a S3 falla
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
