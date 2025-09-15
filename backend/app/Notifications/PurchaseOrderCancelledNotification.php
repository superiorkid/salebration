<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class PurchaseOrderCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected PurchaseOrder $purchaseOrder;
    protected User $cancelled_by;
    protected string $cancellation_reason;


    /**
     * Create a new notification instance.
     */
    public function __construct(
        PurchaseOrder $purchaseOrder,
        User $cancelled_by,
        string $cancellation_reason
    )
    {
        $this->purchaseOrder = $purchaseOrder;
        $this->cancelled_by = $cancelled_by;
        $this->cancellation_reason = $cancellation_reason;
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
            ->subject("Purchase Order #{$this->purchaseOrder->purchase_order_number} Cancelled")
            ->view('emails.purchase-order-cancelled', [
                'purchaseOrder' => $this->purchaseOrder,
                'supplier' => $this->purchaseOrder->supplier,
                'cancelledBy' => $this->cancelled_by,
                'cancellationReason' => $this->cancellation_reason,
                'totalAmount' => $totalAmount
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
            'cancelled_by' => $this->cancelled_by->name,
            'cancelled_by_id' => $this->cancelled_by->id,
            'cancellation_reason' => $this->cancellation_reason,
            'message' => "Purchase Order #{$this->purchaseOrder->purchase_order_number} was cancelled",
        ];
    }
}
