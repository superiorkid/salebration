<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Cancellation Notice - {{ $reorder->purchase_order_number }}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; margin: 20px auto; border-radius: 8px; box-shadow: 0 0 5px rgba(0,0,0,0.05);">
                <tr>
                    <td>
                        <h2 style="color: #e53e3e; font-size: 24px; margin-top: 0;">Order Cancellation Notice</h2>

                        <p>Dear {{ $supplier->name }},</p>

                        <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f1f5f9; border-radius: 6px; margin-top: 20px;">
                            <tr><td><strong>PO Number:</strong> {{ $reorder->purchase_order_number }}</td></tr>
                            <tr><td><strong>Cancelled By:</strong> {{ $cancelledBy->name }}</td></tr>
                            <tr><td><strong>Reason:</strong><br>{{ $reason }}</td></tr>
                        </table>

                        {{-- Optional WhatsApp Button (if needed) --}}
                        {{--
                        <p style="margin-top: 20px;">
                          <a href="{{ $whatsappUrl ?? '#' }}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
                            Contact via WhatsApp
                          </a>
                        </p>
                        --}}

                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;">

                        @include('emails.components.footer')
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
