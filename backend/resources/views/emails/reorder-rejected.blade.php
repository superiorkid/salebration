<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Reorder Rejected - {{ $reorder->purchase_order_number }}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; margin: 20px auto; border-radius: 8px; box-shadow: 0 0 5px rgba(0,0,0,0.05);">
                <tr>
                    <td>
                        <h2 style="color: #dc3545; font-size: 24px; margin-top: 0; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
                            Reorder Rejected
                        </h2>

                        <p>Hello {{ $adminName ?? 'Admin' }},</p>
                        <p>The following reorder has been rejected by the supplier:</p>

                        <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-top: 20px; border-left: 4px solid #dc3545;">
                            <tr><td><strong>PO Number:</strong> {{ $reorder->purchase_order_number }}</td></tr>
                            <tr><td><strong>Product:</strong> {{ $reorder->product_variant->product->name }}</td></tr>
                            <tr><td><strong>Variant:</strong> {{ $reorder->product_variant->value }}</td></tr>
                            <tr><td><strong>Quantity:</strong> {{ $reorder->quantity }}</td></tr>
                            <tr><td><strong>Requested Delivery:</strong> {{ $reorder->expected_at->format('M d, Y') }}</td></tr>

                            @if($reorder->rejection_reason)
                                <tr>
                                    <td style="background: #fff3f3; border-radius: 4px; padding: 10px;">
                                        <strong>Rejection Reason:</strong><br>
                                        {{ $reorder->rejection_reason }}
                                    </td>
                                </tr>
                            @endif
                        </table>

                        <p style="text-align: center; margin-top: 20px;">
                            <a href="{{ $detailUrl }}" style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                                View Reorder Details
                            </a>
                        </p>

                        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 40px 0;">

                        @include('emails.components.footer')
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
