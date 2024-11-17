<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'image' => 'required|image|max:2048', // Ensure it's an image and max size is 2MB
        ]);

        // Store the image in the public/uploads directory
        $path = $request->file('image')->store('uploads', 'public');

        // Return the file's public URL as a response
        return response()->json([
            'success' => true,
            'path' => asset("storage/{$path}"),
        ]);
    }
}
