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
            // Supabase Storage requiere visibilidad explícita 'public'
            return $file->storePublicly($folder, ['disk' => 'supabase']);
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
        Storage::disk($disk === 'supabase' ? 'supabase' : 'public')->delete($path);
    }

    /**
     * Devuelve la URL pública de un archivo.
     */
    public static function url(string $path): string
    {
        $disk = self::disk();

        if ($disk === 'supabase') {
            return Storage::disk('supabase')->url($path);
        }

        return Storage::disk('public')->url($path);
    }
}
