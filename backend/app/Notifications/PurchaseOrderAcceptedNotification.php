<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class PurchaseOrderAcceptedNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected PurchaseOrder $purchaseOrder;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        PurchaseOrder $purchaseOrder
    )
    {
        $this->purchaseOrder = $purchaseOrder;
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
        $totalAmount = $this->purchaseOrder->purchaseOrderItems->sum(function ($item) {
            return $item->unit_price * $item->quantity;
        });

        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $detailUrl = "{$frontendUrl}/inventory/purchase-orders/{$this->purchaseOrder->id}";

        return (new MailMessage)
            ->subject("Purchase Order {$this->purchaseOrder->purchase_order_number} Accepted by Supplier")
            ->view('emails.purchase-order-accepted', [
                "purchaseOrder" => $this->purchaseOrder,
                "totalAmount" => $totalAmount,
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
            'purchase_order_id' => $this->purchaseOrder->id,
            'purchase_order_number' => $this->purchaseOrder->purchase_order_number,
            'message' => "Purchase Order #{$this->purchaseOrder->purchase_order_number} was accepted by supplier",
        ];
    }
}
