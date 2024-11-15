<?php

use App\Http\Controllers\CropImageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});



Route::inertia('/CropImage', 'CropImage');

Route::post('upload', [CropImageController::class, 'upload'])->name('upload');

Route::post('upload','CropImageController@upload')->name('upload');
