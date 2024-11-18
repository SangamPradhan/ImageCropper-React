<?php

use App\Http\Controllers\CropImageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\ImageController;


Route::get('/', function () {
    return Inertia::render('Home');
});



Route::inertia('/CropImage', 'CropImage');

Route::post('upload', [ImageController::class, 'upload'])->name('upload');

Route::post('upload','CropImageController@upload')->name('upload');

Route::post('/images/upload', [ImageController::class, 'upload']);



Route::post('/images/upload', function (Request $request) {
    // Validate the incoming request
    $validatedData = $request->validate([
        'image' => 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Check if the request contains a file
    if ($request->hasFile('image')) {
        // Store the file in the 'public/images' directory
        $path = $request->file('image')->store('images', 'public');

        // Return a success response with the file path
        return response()->json([
            'success' => true,
            'path' => asset('storage/' . $path),
        ]);
    }

    // If no file was uploaded, return an error response
    return response()->json([
        'success' => false,
        'message' => 'No file uploaded.',
    ], 400);
});
