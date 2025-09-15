<?php

namespace App\Notifications;

use App\Models\Reorder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class ReorderRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Reorder $reorder;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        Reorder $reorder,
    )
    {
        $this->reorder = $reorder;
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
        $detailUrl = "{$frontendUrl}/inventory/reorders/{$this->reorder->id}";

        return (new MailMessage)
            ->subject("Reorder Rejected - {$this->reorder->purchase_order_number}")
            ->view('emails.reorder-rejected', [
                'reorder' => $this->reorder,
                'adminName' => config('mail.admin.name', 'Admin'),
                'detailUrl' => $detailUrl,
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
            "reorder_id" => $this->reorder->id,
            "po_number" => $this->reorder->purchase_order_number,
            "message" =>  "Reorder {$this->reorder->purchase_order_number} has been rejected by supplier",
        ];
    }
}
