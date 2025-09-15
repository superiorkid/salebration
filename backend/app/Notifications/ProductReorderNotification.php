<?php

namespace App\Notifications;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Reorder;
use App\Models\Supplier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProductReorderNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Product $product;
    public Reorder $reorder;
    public ProductVariant $variant;
    public Supplier $supplier;
    public int $costPerItem;
    public int $totalCost;
    public string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        Product $product,
        Reorder $reorder,
        ProductVariant $variant,
        Supplier $supplier,
        int $costPerItem,
        int $totalCost,
        string $token
    )
    {
        $this->product = $product;
        $this->reorder = $reorder;
        $this->variant = $variant;
        $this->supplier = $supplier;
        $this->costPerItem = $costPerItem;
        $this->totalCost = $totalCost;
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
 * Get the mail representation of the notification.
 */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $detailUrl = "{$frontendUrl}/supplier/confirmation/reorders/{$this->reorder->id}?token={$this->token}&type=reorder";

        return (new MailMessage)
            ->subject('New Product Reorder - ' . $this->reorder->purchase_order_number)
            ->view("emails.reorder", [
                "reorder" => $this->reorder,
                "variant" => $this->variant,
                "supplier" => $this->supplier,
                "product" => $this->product,
                "costPerItem" => $this->costPerItem,
                "totalCost" => $this->totalCost,
                "detailUrl" => $detailUrl,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'reorder_id' => $this->reorder->id,
            'po_number' => $this->reorder->purchase_order_number,
            'quantity' => $this->reorder->quantity,
            'message' => 'New reorder for product: ' . $this->product->name,
        ];
    }
}
