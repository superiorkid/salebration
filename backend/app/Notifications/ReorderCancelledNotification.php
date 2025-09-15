<?php

namespace App\Notifications;

use App\Models\Reorder;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class ReorderCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Reorder $reorder;
    public User $cancelled_by;
    public Supplier $supplier;
    public string $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        Reorder $reorder,
        User $cancelled_by,
        Supplier $supplier,
        string $reason,
    )
    {
        $this->reorder = $reorder;
        $this->cancelled_by = $cancelled_by;
        $this->supplier = $supplier;
        $this->reason = $reason;
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
        return (new MailMessage)
            ->subject("Reorder Cancelled: {$this->reorder->purchase_order_number}")
            ->view('emails.reorder-cancelled', [
                'reason' => $this->reason,
                'reorder' => $this->reorder,
                'cancelledBy' => $this->cancelled_by,
                'supplier' => $this->supplier,
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
            'type' => 'reorder_cancelled',
            'reorder_id' => $this->reorder->id,
            'cancelled_by' => [
                'id' => $this->cancelledBy->id,
                'name' => $this->cancelledBy->name
            ],
            'po_number' => $this->reorder->purchase_order_number,
            'reason' => $this->reason,
            'message' => "{$this->reorder->purchase_order_number} cancelled",
        ];
    }
}
