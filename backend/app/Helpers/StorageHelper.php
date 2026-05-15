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
            // Upload using Supabase REST API directly
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $path = $folder . '/' . $filename;
            
            $url = env('SUPABASE_STORAGE_ENDPOINT') . '/object/images/' . $path; // images is the bucket name
            // If SUPABASE_STORAGE_ENDPOINT is the S3 endpoint, we need to fix it:
            // e.g. https://ohbenoeiqlkcmhksbgnz.supabase.co/storage/v1
            $baseUrl = str_replace('/s3', '', env('SUPABASE_STORAGE_ENDPOINT'));
            if (!str_contains($baseUrl, 'storage/v1')) {
                // Construct from DB_HOST
                $projectRef = explode('.', env('DB_HOST'))[0]; 
                // DB_HOST might be aws-1-us-east-1.pooler.supabase.com, so we shouldn't rely on it.
                // We'll use SUPABASE_STORAGE_URL which is the public object URL:
                // https://ohbenoeiqlkcmhksbgnz.supabase.co/storage/v1/object/public
                $baseUrl = str_replace('/object/public', '', env('SUPABASE_STORAGE_URL'));
            }
            
            $uploadUrl = rtrim($baseUrl, '/') . '/object/images/' . $path;
            
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . env('SUPABASE_STORAGE_SECRET'), // service_role key
                'Content-Type'  => $file->getMimeType(),
            ])->send('POST', $uploadUrl, [
                'body' => file_get_contents($file->getRealPath())
            ]);

            if ($response->successful()) {
                return $path;
            }
            
            // If it fails, fallback to local so it doesn't crash completely,
            // or log the error.
            \Illuminate\Support\Facades\Log::error('Supabase upload failed: ' . $response->body());
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
