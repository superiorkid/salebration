<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();

            $table->string("attribute");
            $table->string("value");
            $table
                ->string("sku_suffix")
                ->index();
            $table
                ->string("barcode")
                ->unique()
                ->nullable();

            $table->integer("additional_price")->default(0);
            $table->integer("quantity")->default(0);
            $table->integer("min_stock_level")->default(0);

            $table->unsignedBigInteger("product_id");
            $table
                ->foreign('product_id')
                ->references('id')
                ->on('products')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
