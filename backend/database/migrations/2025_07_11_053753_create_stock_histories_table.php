<?php

use App\Enums\StockHistoryTypeEnum;
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
        Schema::create('stock_histories', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('product_variant_id');
            $table->unsignedBigInteger("performed_by_id")->nullable()->comment("FK to users");

            $table->enum("type", array_column(StockHistoryTypeEnum::cases(), 'value'));

            $table->integer("quantity_before");
            $table->integer("quantity_change");
            $table->integer("quantity_after");

            $table->morphs("reference");

            $table->text("notes")->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->foreign('product_variant_id')
                ->references('id')
                ->on('product_variants')
                ->onDelete('cascade');
            $table->foreign('performed_by_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_histories');
    }
};
