<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| Rutas Públicas
|--------------------------------------------------------------------------
*/

// Servicios (solo activos)
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);

// Categorías
Route::get('/categories', [CategoryController::class, 'index']);

// Galería
Route::get('/gallery', [GalleryController::class, 'index']);

// Horarios
Route::get('/schedules', [ScheduleController::class, 'index']);

// Horarios disponibles
Route::get('/available-slots', [AppointmentController::class, 'availableSlots']);

// Crear cita (público)
Route::post('/appointments', [AppointmentController::class, 'store']);

// Configuraciones públicas
Route::get('/settings', [SettingController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Rutas de Autenticación
|--------------------------------------------------------------------------
*/

Route::post('/admin/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Admin)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Citas
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'adminStore']);
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);

    // Servicios
    Route::post('/services', [ServiceController::class, 'store']);
    Route::post('/services/{service}', [ServiceController::class, 'update']); // POST para FormData con imagen
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    // Categorías
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Galería
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{gallery}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);

    // Horarios
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
    Route::put('/schedules', [ScheduleController::class, 'bulkUpdate']);

    // Configuraciones
    Route::put('/settings', [SettingController::class, 'update']);
});
