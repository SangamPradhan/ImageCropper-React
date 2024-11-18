<?php
namespace App\Http\Controllers;

use App\Models\CropImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'image' => 'required|image|max:2048', // Ensure it's an image and max size is 2MB
            'crop_dimensions' => 'required|array', // Validate that crop_dimensions is an array
            'crop_dimensions.x' => 'required|integer',
            'crop_dimensions.y' => 'required|integer',
            'crop_dimensions.width' => 'required|integer',
            'crop_dimensions.height' => 'required|integer',
        ]);

        // Store the image in the public/uploads directory
        $path = $request->file('image')->store('uploads', 'public');

        // Retrieve crop dimensions from the request
        $cropDimensions = $request->input('crop_dimensions');

        CropImage::create([
            'path' => $path,
            'crop_x' => $cropDimensions['x'],
            'crop_y' => $cropDimensions['y'],
            'crop_width' => $cropDimensions['width'],
            'crop_height' => $cropDimensions['height'],
        ]);

        // Return the file's public URL as a response
        return response()->json([
            'success' => true,
            'path' => asset("storage/{$path}"),
        ]);
    }
}
