<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Product Reorder</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <table width="600" cellpadding="20" cellspacing="0" style="background-color: #ffffff; margin: 20px auto; border-radius: 8px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
                <tr>
                    <td>
                        <h2 style="color: #2d3748; font-size: 24px; margin-top: 0;">New Product Reorder</h2>
                        <p>Hello {{ $supplier->name }},</p>
                        <p>We've placed a new order with the following details:</p>

                        <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f1f5f9; border-radius: 6px; margin-bottom: 20px;">
                            <tr><td><strong>Product:</strong> {{ $product->name }}</td></tr>
                            <tr><td><strong>Variant:</strong> {{ $variant->value }}</td></tr>
                            <tr><td><strong>PO Number:</strong> {{ $reorder->purchase_order_number }}</td></tr>
                            <tr><td><strong>Quantity:</strong> {{ $reorder->quantity }} units</td></tr>
                            <tr><td><strong>Unit Price:</strong> {{ format_idr($costPerItem) }}</td></tr>
                            <tr><td><strong>Total Amount:</strong> {{ format_idr($totalCost) }}</td></tr>
                            <tr><td><strong>Expected Delivery:</strong> <span style="color: #e53e3e; font-weight: bold;">{{ $reorder->expected_at->format('M d, Y') }}</span></td></tr>
                        </table>

                        @if($reorder->notes)
                            <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #fff3cd; border-left: 5px solid #ffc107; border-radius: 4px; margin-bottom: 20px;">
                                <tr>
                                    <td>
                                        <p><strong>📌 Special Instructions:</strong></p>
                                        <p>{{ $reorder->notes }}</p>
                                    </td>
                                </tr>
                            </table>
                        @endif

                        <p style="margin: 30px 0 10px;">Please click the button below to view the complete order details:</p>
                        <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                            <tr>
                                <td>
                                    <a href="{{ $detailUrl }}" style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Complete Order Details</a>
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
