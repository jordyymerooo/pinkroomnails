<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\GalleryImage;
use App\Models\Schedule;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ──────────────────────────────────────────────
        // Usuario Administrador
        // ──────────────────────────────────────────────
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@glamournails.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // ──────────────────────────────────────────────
        // Servicios
        // ──────────────────────────────────────────────
        $services = [
            [
                'name' => 'Manicure Clásica',
                'description' => 'Limpieza, limado, cutículas y esmaltado tradicional. Incluye hidratación de manos con cremas premium.',
                'price' => 25.00,
                'duration_minutes' => 60,
                'category' => 'manicure',
                'sort_order' => 1,
            ],
            [
                'name' => 'Manicure en Gel',
                'description' => 'Aplicación de esmalte en gel de larga duración con secado UV. Brillo espejo que dura hasta 3 semanas.',
                'price' => 45.00,
                'duration_minutes' => 60,
                'category' => 'manicure',
                'sort_order' => 2,
            ],
            [
                'name' => 'Uñas Acrílicas',
                'description' => 'Extensión de uñas con acrílico profesional. Incluye diseño personalizado y acabado de alto brillo.',
                'price' => 65.00,
                'duration_minutes' => 60,
                'category' => 'acrilicas',
                'sort_order' => 3,
            ],
            [
                'name' => 'Nail Art Premium',
                'description' => 'Diseños artísticos exclusivos hechos a mano. Desde minimalistas hasta elaborados con piedras y detalles 3D.',
                'price' => 80.00,
                'duration_minutes' => 60,
                'category' => 'nail_art',
                'sort_order' => 4,
            ],
            [
                'name' => 'Pedicure Spa',
                'description' => 'Tratamiento completo de pies con baño relajante, exfoliación, masaje y esmaltado. Una experiencia de lujo.',
                'price' => 40.00,
                'duration_minutes' => 60,
                'category' => 'pedicure',
                'sort_order' => 5,
            ],
            [
                'name' => 'Press-On Personalizadas',
                'description' => 'Uñas press-on diseñadas a medida para ti. Fáciles de aplicar y reutilizables. Incluye kit de aplicación.',
                'price' => 55.00,
                'duration_minutes' => 60,
                'category' => 'press_on',
                'sort_order' => 6,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        // ──────────────────────────────────────────────
        // Horarios (Lunes a Sábado, 9:00 - 19:00)
        // ──────────────────────────────────────────────
        $schedules = [
            ['day_of_week' => 0, 'start_time' => '00:00', 'end_time' => '00:00', 'is_active' => false], // Domingo cerrado
            ['day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],
            ['day_of_week' => 2, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],
            ['day_of_week' => 3, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],
            ['day_of_week' => 4, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],
            ['day_of_week' => 5, 'start_time' => '09:00', 'end_time' => '19:00', 'is_active' => true],
            ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '14:00', 'is_active' => true],  // Sábado medio día
        ];

        foreach ($schedules as $schedule) {
            Schedule::create($schedule);
        }

        // ──────────────────────────────────────────────
        // Testimonios
        // ──────────────────────────────────────────────
        $testimonials = [
            [
                'client_name' => 'María García',
                'content' => '¡Increíble experiencia! Mis uñas quedaron perfectas. El diseño que me hicieron fue exactamente lo que quería. Definitivamente regresaré.',
                'rating' => 5,
                'is_visible' => true,
            ],
            [
                'client_name' => 'Ana López',
                'content' => 'El servicio de pedicure spa es maravilloso. Muy relajante y profesional. Las instalaciones son hermosas y el ambiente muy acogedor.',
                'rating' => 5,
                'is_visible' => true,
            ],
            [
                'client_name' => 'Carolina Ruiz',
                'content' => 'Las uñas acrílicas me duraron más de 3 semanas sin levantarse. Excelente calidad y atención personalizada. ¡Super recomendado!',
                'rating' => 5,
                'is_visible' => true,
            ],
            [
                'client_name' => 'Laura Martínez',
                'content' => 'Me encanta el nail art que hacen aquí. Los diseños son únicos y muy creativos. Siempre recibo muchos cumplidos por mis uñas.',
                'rating' => 4,
                'is_visible' => true,
            ],
            [
                'client_name' => 'Sofía Herrera',
                'content' => 'Excelente atención y puntualidad. El sistema de reservas es muy fácil de usar. Las chicas son muy profesionales y amables.',
                'rating' => 5,
                'is_visible' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }

        // ──────────────────────────────────────────────
        // Configuraciones
        // ──────────────────────────────────────────────
        $settings = [
            'salon_name' => 'Glamour Nails Studio',
            'salon_phone' => '+57 300 123 4567',
            'salon_email' => 'info@glamournails.com',
            'salon_address' => 'Calle 123 #45-67, Centro Comercial Premium, Local 201',
            'whatsapp_number' => '573001234567',
            'whatsapp_message' => '¡Hola! Me gustaría reservar una cita en Glamour Nails Studio 💅',
            'instagram' => 'https://instagram.com/glamournails',
            'facebook' => 'https://facebook.com/glamournails',
            'tiktok' => 'https://tiktok.com/@glamournails',
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }

        // ──────────────────────────────────────────────
        // Citas de ejemplo
        // ──────────────────────────────────────────────
        $statuses = ['pending', 'confirmed', 'completed'];
        $names = ['Isabella Torres', 'Valentina Morales', 'Camila Sánchez', 'Luciana Díaz', 'Emma Vargas'];
        
        for ($i = 0; $i < 10; $i++) {
            $date = Carbon::now()->addDays(rand(-5, 15));
            // Solo días laborales
            while ($date->dayOfWeek === 0) {
                $date->addDay();
            }
            
            Appointment::create([
                'service_id' => rand(1, 6),
                'client_name' => $names[array_rand($names)],
                'client_phone' => '+57 3' . rand(10, 99) . ' ' . rand(100, 999) . ' ' . rand(1000, 9999),
                'client_email' => 'cliente' . $i . '@email.com',
                'appointment_date' => $date->format('Y-m-d'),
                'appointment_time' => sprintf('%02d:%s', rand(9, 17), ['00', '30'][rand(0, 1)]),
                'status' => $date->isPast() ? 'completed' : $statuses[array_rand($statuses)],
                'notes' => null,
            ]);
        }
    }
}
