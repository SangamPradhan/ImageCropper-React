<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('crop_images', function (Blueprint $table) {
            $table->id();
            $table->string('image_path'); // Path to the cropped image
            $table->integer('x')->nullable(); // X coordinate
            $table->integer('y')->nullable(); // Y coordinate
            $table->integer('width')->nullable(); // Width of the cropped image
            $table->integer('height')->nullable(); // Height of the cropped image
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crop_images');
    }
};
