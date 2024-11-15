<?php

namespace App\Http\Controllers;

use App\Models\CropImage;
use App\Http\Requests\StoreCropImageRequest;
use App\Http\Requests\UpdateCropImageRequest;
use Illuminate\Http\Request;

class CropImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function upload(Request $request)
    {
        if ($request->hasFile('image')) {
            $imageName = time() . '_' . $request->image->getClientOriginalName(); // Generate a unique filename
            $request->image->storeAs('public/Images', $imageName); // Store the image in 'public/Images'

            return response()->json(['message' => 'Image uploaded successfully', 'image_name' => $imageName], 200);
        }
        return response()->json(['message' => 'No image uploaded'], 400);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // Store a newly created resource in storage.
        public function store(StoreCropImageRequest $request)
        {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Store the image
            $path = $request->file('image')->store('cropped_images', 'public');

            // Save the file path in the database
            $image = new CropImage();
            $image->image_path = $path; // Ensure this matches the model attribute
            $image->save();

            return response()->json(['success' => true, 'path' => $path]);
        }


    /**
     * Display the specified resource.
     */
    public function show(CropImage $cropImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CropImage $cropImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCropImageRequest $request, CropImage $cropImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CropImage $cropImage)
    {
        //
    }
}
