<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$services = App\Models\Service::all();

$translations = [
    'Set completo pequeño' => ['name' => 'Short Full Set Acrylics', 'category' => 'acrylics', 'description' => 'A full set of short acrylic nail extensions.'],
    'Set completo mediano' => ['name' => 'Medium Full Set Acrylics', 'category' => 'acrylics', 'description' => 'A full set of medium acrylic nail extensions.'],
    'Set completo grande' => ['name' => 'Long Full Set Acrylics', 'category' => 'acrylics', 'description' => 'A full set of long acrylic nail extensions.'],
    'Relleno' => ['name' => 'Acrylic Fill-in', 'category' => 'acrylics', 'description' => 'Maintenance and fill-in for your acrylic nails.'],
    
    'Set completo pequeño (Soft Gel)' => ['name' => 'Short Full Set Soft Gel', 'category' => 'gel', 'description' => 'Short soft gel extensions.'],
    'Set completo mediano (Soft Gel)' => ['name' => 'Medium Full Set Soft Gel', 'category' => 'gel', 'description' => 'Medium soft gel extensions.'],
    'Set completo grande (Soft Gel)' => ['name' => 'Long Full Set Soft Gel', 'category' => 'gel', 'description' => 'Long soft gel extensions.'],
    'Relleno (Soft Gel)' => ['name' => 'Soft Gel Fill-in', 'category' => 'gel', 'description' => 'Fill-in for soft gel nails.'],

    'Set completo pequeño (Gel Líquido)' => ['name' => 'Short Full Set Hard Gel', 'category' => 'gel', 'description' => 'Short hard gel extensions.'],
    'Set completo mediano (Gel Líquido)' => ['name' => 'Medium Full Set Hard Gel', 'category' => 'gel', 'description' => 'Medium hard gel extensions.'],
    'Relleno (Gel Líquido)' => ['name' => 'Hard Gel Fill-in', 'category' => 'gel', 'description' => 'Fill-in for hard gel nails.'],

    'Pedicura' => ['name' => 'Classic Pedicure', 'category' => 'pedicure', 'description' => 'Classic pedicure with cuticle care and polish.'],
    'Pedicura Spa' => ['name' => 'Spa Pedicure', 'category' => 'pedicure', 'description' => 'Relaxing spa pedicure with exfoliation and massage.'],

    'Manicura con gel' => ['name' => 'Gel Manicure', 'category' => 'manicure', 'description' => 'Classic manicure finished with gel polish.'],
    'Manicura para niños' => ['name' => 'Kids Manicure', 'category' => 'manicure', 'description' => 'Gentle manicure for children.'],

    'Retiros' => ['name' => 'Removal', 'category' => 'add_ons', 'description' => 'Safe removal of enhancements.'],
    
    'Punta francesa (French)' => ['name' => 'French Tip', 'category' => 'nail_art', 'description' => 'Classic french tip design.'],
    'Flores 3D' => ['name' => '3D Flowers', 'category' => 'nail_art', 'description' => 'Beautiful 3D floral acrylic designs.'],
    'Dijes (Charms)' => ['name' => 'Nail Charms', 'category' => 'nail_art', 'description' => 'Add custom charms to your nails.'],
    'Cromo / Efecto espejo' => ['name' => 'Chrome Effect', 'category' => 'nail_art', 'description' => 'Mirror-like chrome powder finish.'],
    'Pedrería (Rhinestones)' => ['name' => 'Rhinestones', 'category' => 'nail_art', 'description' => 'Swarovski crystals and rhinestones.'],
    'Diseños' => ['name' => 'Custom Designs', 'category' => 'nail_art', 'description' => 'Custom hand-painted designs.'],
    'Encapsulado' => ['name' => 'Encapsulated Design', 'category' => 'nail_art', 'description' => 'Glitter or designs encapsulated in clear acrylic.'],
    
    // Y en caso de que ya se haya traducido el Short Full Set Acrylics y estemos re-corriendo el script:
    'Short Full Set Acrylics' => ['name' => 'Short Full Set Acrylics', 'category' => 'acrylics', 'description' => 'A full set of short acrylic nail extensions.']
];

foreach ($services as $service) {
    echo "Found: {$service->name}\n";
    if (isset($translations[$service->name])) {
        $trans = $translations[$service->name];
        $service->name = $trans['name'];
        $service->category = $trans['category'];
        $service->description = $trans['description'];
        $service->save();
        echo "Translated -> {$trans['name']} ({$trans['category']})\n";
    } else {
        if ($service->category == 'Adicionales') {
            $service->category = 'add_ons';
            $service->save();
        } elseif ($service->category == 'acrilicas') {
            $service->category = 'acrylics';
            $service->save();
        }
    }
}
echo "Done.\n";
