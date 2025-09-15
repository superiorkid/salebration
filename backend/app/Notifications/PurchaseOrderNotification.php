<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class PurchaseOrderNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected PurchaseOrder $purchaseOrder;
    protected string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        PurchaseOrder $purchaseOrder,
        string $token
    )
    {
        $this->purchaseOrder = $purchaseOrder;
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
        $adminName = config("mail.admin.name");
        $totalAmount = $this->purchaseOrder->purchaseOrderItems->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        });

        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $detailUrl = "{$frontendUrl}/supplier/confirmation/purchase-orders/{$this->purchaseOrder->id}?token={$this->token}&type=purchase-order";

        return (new MailMessage)
            ->subject("New Purchase Order #{$this->purchaseOrder->purchase_order_number}")
            ->view('emails.purchase-order', [
                "purchaseOrder" => $this->purchaseOrder,
                "adminName" => $adminName,
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
            "type" => "purchase-order-created",
            "purchase_order_id" => $this->purchaseOrder->id,
            "purchase_order_number" => $this->purchaseOrder->purchase_order_number,
            "supplier_name" => $this->purchaseOrder->supplier->name,
            "expected_at" => $this->purchaseOrder->expected_at
        ];
    }
}
