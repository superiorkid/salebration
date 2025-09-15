<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reorder Accepted - {{ $reorder->purchase_order_number }}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; margin: 20px auto; border-radius: 8px; box-shadow: 0 0 5px rgba(0,0,0,0.05);">
                <tr>
                    <td>
                        <h2 style="color: #2d3748; font-size: 24px; margin-top: 0;">Reorder Accepted</h2>

                        <p style="margin: 0 0 16px;">Hello {{ $adminName }},</p>
                        <p style="margin: 0 0 16px;">The following reorder has been accepted by the supplier:</p>

                        <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f1f5f9; border-radius: 6px; margin-bottom: 20px;">
                            <tr><td><strong>PO Number:</strong> {{ $reorder->purchase_order_number }}</td></tr>
                            <tr><td><strong>Product:</strong> {{ $reorder->product_variant->product->name }}</td></tr>
                            <tr><td><strong>Variant:</strong> {{ $reorder->product_variant->value }}</td></tr>
                            <tr><td><strong>Quantity:</strong> {{ $reorder->quantity }}</td></tr>
                            <tr><td><strong>Expected Delivery:</strong> {{ $reorder->expected_at->format('M d, Y') }}</td></tr>

                            @if($reorder->acceptance_notes)
                                <tr>
                                    <td>
                                        <strong>Supplier Notes:</strong><br>
                                        {{ $reorder->acceptance_notes }}
                                    </td>
                                </tr>
                            @endif
                        </table>

                        <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center; margin-bottom: 20px;">
                            <tr>
                                <td>
                                    <a href="{{ $detailUrl }}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                                        View Reorder Details
                                    </a>
                                </td>
                            </tr>
                        </table>

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
