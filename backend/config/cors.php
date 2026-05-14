<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Aquí configuramos los permisos para que tu frontend en React 19 pueda
    | comunicarse con tu API de Laravel en producción y local.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'), // URL de producción y local
        'https://*.vercel.app',                       // Permite previsualizaciones de Vercel
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /* | Importante: Debe ser true para que Laravel Sanctum pueda 
    | manejar las cookies de sesión y tokens del administrador.
    */
    'supports_credentials' => true,

];