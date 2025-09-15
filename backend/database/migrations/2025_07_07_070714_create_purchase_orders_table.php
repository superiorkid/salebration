<?php

use App\Enums\OrderStatusEnum;
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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger("supplier_id");
            $table->unsignedBigInteger("cancelled_by_id")->nullable();

            $table->string("purchase_order_number")->unique()->index();

            $table
                ->enum("status", array_column(OrderStatusEnum::cases(), 'value'))
                ->index()
                ->default(OrderStatusEnum::PENDING->value);

            $table->dateTime("expected_at")->nullable();
            $table->dateTime("received_at")->nullable();
            $table->dateTime("cancelled_at")->nullable();
            $table->dateTime("accepted_at")->nullable();
            $table->dateTime("rejected_at")->nullable();

            $table->text("notes")->nullable();
            $table->text("acceptance_notes")->nullable();
            $table->text("cancellation_reason")->nullable();
            $table->text("rejection_reason")->nullable();

            $table->timestamps();

            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->foreign('cancelled_by_id')->references('id')->on('users');
        });

        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger("purchase_order_id");
            $table->unsignedBigInteger("product_variant_id");

            $table->integer("quantity")->default(0);
            $table->integer("unit_price")->default(0);
            $table->integer("received_quantity")->default(0);

            $table->timestamps();

            $table
                ->foreign('purchase_order_id')
                ->references('id')
                ->on('purchase_orders')
                ->ondelete('cascade');
            $table->foreign('product_variant_id')->references('id')->on('product_variants');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
    }
};
