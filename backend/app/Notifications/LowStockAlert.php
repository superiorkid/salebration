<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;

class LowStockAlert extends Notification implements ShouldQueue
{
    use Queueable;

    protected Collection $lowStockProductData;

    /**
     * Create a new notification instance.
     *
     * @param Collection<int, LowStockProductData> $lowStockProductData
     */
    public function __construct(Collection $lowStockProductData)
    {
        $this->lowStockProductData = $lowStockProductData;
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
        $ownerName = env('OWNER_NAME', "Store Owner");

        $mail = (new MailMessage)
            ->subject('🔔 Low Stock Alert - Restocking Needed')
            ->greeting("Hi {$ownerName},")
            ->line('The following products are running low on stock:');

        foreach ($this->data->products as $product) {
            $mail->line("- {$product->name} (SKU: {$product->sku}) — Stock: {$product->stock}/{$product->threshold}");
        }

        $mail->action('Go to Inventory Dashboard', url('/dashboard/inventory'))
            ->line('Please restock soon to avoid running out of stock.');

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'data' => $this->lowStockProductData,
        ];
    }

}
