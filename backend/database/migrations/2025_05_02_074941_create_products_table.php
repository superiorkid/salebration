<?php

use App\Enums\StatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table
                ->string("sku")
                ->unique()
                ->index();
            $table
                ->string('name')
                ->unique();
            $table
                ->string('slug')
                ->unique()
                ->index();

            $table
                ->text('description')
                ->nullable();

            $table
                ->integer('base_price')
                ->default(0);

            $table
                ->enum("status", array_column(StatusEnum::cases(), 'value'))
                ->default(StatusEnum::ACTIVE->value);

            $table
                ->unsignedBigInteger('category_id')
                ->nullable();
            $table
                ->foreign('category_id')
                ->references('id')
                ->on('product_categories')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->unsignedBigInteger('supplier_id');
            $table
                ->foreign('supplier_id')
                ->references('id')
                ->on('suppliers')
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
        Schema::dropIfExists('products');
    }
};
