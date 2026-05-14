<?php

namespace App;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Service;
use Illuminate\Support\Facades\DB;

DB::statement("SET session_replication_role = 'replica';");
DB::table('appointments')->delete();
Service::query()->delete();
DB::statement("SET session_replication_role = 'origin';");

$services = [
    // Uñas Acrílicas
    ['name' => 'Set completo pequeño', 'price' => 40.00, 'duration_minutes' => 60, 'category' => 'Uñas Acrílicas', 'description' => 'Aplicación de uñas acrílicas tamaño pequeño.'],
    ['name' => 'Set completo mediano', 'price' => 45.00, 'duration_minutes' => 75, 'category' => 'Uñas Acrílicas', 'description' => 'Aplicación de uñas acrílicas tamaño mediano.'],
    ['name' => 'Set completo grande', 'price' => 55.00, 'duration_minutes' => 90, 'category' => 'Uñas Acrílicas', 'description' => 'Aplicación de uñas acrílicas tamaño grande.'],
    ['name' => 'Relleno', 'price' => 40.00, 'duration_minutes' => 60, 'category' => 'Uñas Acrílicas', 'description' => 'Mantenimiento de uñas acrílicas.'],

    // Gel Suave (Soft Gel)
    ['name' => 'Set completo pequeño (Soft Gel)', 'price' => 35.00, 'duration_minutes' => 60, 'category' => 'Gel Suave', 'description' => 'Aplicación de soft gel tamaño pequeño.'],
    ['name' => 'Set completo mediano (Soft Gel)', 'price' => 40.00, 'duration_minutes' => 75, 'category' => 'Gel Suave', 'description' => 'Aplicación de soft gel tamaño mediano.'],
    ['name' => 'Set completo grande (Soft Gel)', 'price' => 50.00, 'duration_minutes' => 90, 'category' => 'Gel Suave', 'description' => 'Aplicación de soft gel tamaño grande.'],
    ['name' => 'Relleno (Soft Gel)', 'price' => 35.00, 'duration_minutes' => 60, 'category' => 'Gel Suave', 'description' => 'Mantenimiento de soft gel.'],

    // Gel Líquido
    ['name' => 'Set completo pequeño (Gel Líquido)', 'price' => 40.00, 'duration_minutes' => 60, 'category' => 'Gel Líquido', 'description' => 'Aplicación de gel líquido tamaño pequeño.'],
    ['name' => 'Set completo mediano (Gel Líquido)', 'price' => 50.00, 'duration_minutes' => 75, 'category' => 'Gel Líquido', 'description' => 'Aplicación de gel líquido tamaño mediano.'],
    ['name' => 'Relleno (Gel Líquido)', 'price' => 35.00, 'duration_minutes' => 60, 'category' => 'Gel Líquido', 'description' => 'Mantenimiento de gel líquido.'],

    // Pedicura con Gel
    ['name' => 'Pedicura', 'price' => 30.00, 'duration_minutes' => 45, 'category' => 'Pedicura con Gel', 'description' => 'Limpieza, corte y esmaltado en gel para pies.'],
    ['name' => 'Pedicura Spa', 'price' => 40.00, 'duration_minutes' => 60, 'category' => 'Pedicura con Gel', 'description' => 'Tratamiento completo con exfoliación y masaje.'],

    // Manicura
    ['name' => 'Manicura con gel', 'price' => 25.00, 'duration_minutes' => 45, 'category' => 'Manicura', 'description' => 'Limpieza y esmaltado en gel para manos.'],
    ['name' => 'Manicura para niños', 'price' => 10.00, 'duration_minutes' => 30, 'category' => 'Manicura', 'description' => 'Servicio especial de manicura para los más pequeños.'],

    // Adicionales
    ['name' => 'Retiros', 'price' => 5.00, 'duration_minutes' => 15, 'category' => 'Adicionales', 'description' => 'Retiro cuidadoso del producto.'],
    ['name' => 'Punta francesa (French)', 'price' => 5.00, 'duration_minutes' => 15, 'category' => 'Adicionales', 'description' => 'Diseño clásico francés.'],
    ['name' => 'Flores 3D', 'price' => 5.00, 'duration_minutes' => 15, 'category' => 'Adicionales', 'description' => 'Decoración con flores en relieve 3D.'],
    ['name' => 'Dijes (Charms)', 'price' => 2.00, 'duration_minutes' => 5, 'category' => 'Adicionales', 'description' => 'Aplicación de dijes decorativos.'],
    ['name' => 'Cromo / Efecto espejo', 'price' => 2.00, 'duration_minutes' => 10, 'category' => 'Adicionales', 'description' => 'Efecto metálico o espejo.'],
    ['name' => 'Pedrería (Rhinestones)', 'price' => 3.00, 'duration_minutes' => 10, 'category' => 'Adicionales', 'description' => 'Aplicación de cristales.'],
    ['name' => 'Diseños', 'price' => 5.00, 'duration_minutes' => 15, 'category' => 'Adicionales', 'description' => 'Diseños a mano alzada.'],
    ['name' => 'Encapsulado', 'price' => 5.00, 'duration_minutes' => 15, 'category' => 'Adicionales', 'description' => 'Decoración encapsulada.'],
];

foreach ($services as $i => $s) {
    $s['is_active'] = true;
    $s['sort_order'] = $i;
    Service::create($s);
}

echo "Services seeded successfully!\n";
