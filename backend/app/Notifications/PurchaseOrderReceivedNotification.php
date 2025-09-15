<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class PurchaseOrderReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected PurchaseOrder $purchaseOrder;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        PurchaseOrder $purchaseOrder,
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
            return $item->quantity * $item->unit_price;
        });

        return (new MailMessage)
            ->subject("Purchase Order #{$this->purchaseOrder->id} Fully Received - " . config('app.name'))
            ->view("emails.purchase-order-received", [
                "purchaseOrder" => $this->purchaseOrder,
                "totalAmount" => $totalAmount,
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
            'title' => "Purchase Order #{$this->purchaseOrder->id} Received",
            'message' => "All items from PO #{$this->purchaseOrder->id} have been received.",
            'supplier_name' => $this->purchaseOrder->supplier->name,
        ];
    }
}
