<?php

use App\Enums\PaymentMethodEnum;
use App\Enums\SaleStatusEnum;
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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('operator_id');

            $table->integer("total")->default(0);
            $table->integer("paid")->default(0);
            $table->integer("change")->default(0);

            $table
                ->enum("status", array_column(SaleStatusEnum::cases(), 'value'))
                ->default(SaleStatusEnum::PENDING->value);

            $table->timestamps();

            $table
                ->foreign('operator_id')
                ->references('id')->on('users');
        });

        Schema::create("sale_items", function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger("sale_id");
            $table->unsignedBigInteger("product_variant_id");

            $table
                ->integer("quantity")
                ->default(0);
        $table
                ->integer("price")
                ->default(0)
                ->comment("snapshot of price time of sale");
            $table
                ->integer("subtotal")
                ->default(0);

            $table->timestamps();

            $table
                ->foreign('sale_id')
                ->references('id')
                ->on('sales');
            $table
                ->foreign('product_variant_id')
                ->references('id')
                ->on('product_variants');
        });

        Schema::create("payments", function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger("sale_id");

            $table->enum("method", array_column(PaymentMethodEnum::cases(), 'value'));

            $table->integer("amount")->default(0);

            $table
                ->dateTime("paid_at")
                ->default(now())
                ->nullable();

            $table->timestamps();

            $table
                ->foreign("sale_id")
                ->references("id")
                ->on("sales")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
        Schema::dropIfExists('sale_items');
    }
};
