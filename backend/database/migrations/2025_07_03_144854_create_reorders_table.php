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
        Schema::create('reorders', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('product_variant_id');
            $table->unsignedBigInteger('cancelled_by_id')->nullable();

            $table->string("purchase_order_number")
                ->unique()
                ->index();

            $table->integer('quantity');

            $table
                ->enum("status", array_column(OrderStatusEnum::cases(), "value"))
                ->default(OrderStatusEnum::PENDING->value);

            $table->dateTime('expected_at')->nullable();
            $table->dateTime('received_at')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->dateTime('accepted_at')->nullable();
            $table->dateTime('rejected_at')->nullable();

            $table->integer("cost_per_item")->nullable();

            $table->text("notes")->nullable();
            $table->text("acceptance_notes")->nullable();
            $table->text("cancellation_reason")->nullable();
            $table->text("rejection_reason")->nullable();

            $table->timestamps();

            $table->foreign('product_variant_id')->references('id')->on('product_variants');
            $table->foreign('cancelled_by_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reorders');
    }
};
