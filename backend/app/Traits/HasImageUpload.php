<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;

trait HasImageUpload
{
    public function uploadImages(
        array $images,
        string $collection = "default",
        string $disk = "public"
    ): void {
        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $this->addMedia($image)
                    ->toMediaCollection($collection, $disk);
            }
        }
    }

    public function uploadImage(
        UploadedFile|string|null $image,
        string                   $collection = "default",
        string                   $disk = "public"
    ): void
    {
        if (!$image instanceof UploadedFile) return;
        $this->clearMediaCollection($collection);
        $this
            ->addMedia($image)
            ->toMediaCollection($collection, $disk);
    }
}
