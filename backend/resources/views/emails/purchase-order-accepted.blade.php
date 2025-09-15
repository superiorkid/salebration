<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Purchase Order Accepted - #{{ $purchaseOrder->purchase_order_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            background: #fff;
            margin: 30px auto;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);
        }
        .header {
            text-align: center;
            color: #2d3748;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 15px;
        }
        .header h1 {
            font-size: 22px;
            margin: 0;
        }
        .success-badge {
            display: inline-block;
            background: #38a169;
            color: #fff;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }
        .card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .notes-box {
            background: #f0fff4;
            border-left: 4px solid #38a169;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th {
            background: #edf2f7;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            text-align: left;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .text-right {
            text-align: right;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: #4299e1;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px auto;
            text-align: center;
        }
        .footer {
            font-size: 12px;
            color: #718096;
            text-align: center;
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Purchase Order Accepted</h1>
        <span class="success-badge">ACCEPTED</span>
    </div>

    <p>Hello Admin,</p>

    <p>The supplier has accepted the following purchase order:</p>

    <div class="card">
        <p><strong>PO Number:</strong> #{{ $purchaseOrder->purchase_order_number }}</p>
        <p><strong>Supplier:</strong> {{ $purchaseOrder->supplier->name }}</p>
        <p><strong>Order Date:</strong> {{ $purchaseOrder->created_at->format('F j, Y') }}</p>
        <p><strong>Accepted At:</strong> {{ $purchaseOrder->accepted_at->format('F j, Y H:i') }}</p>
        <p><strong>Total Amount:</strong> {{ format_idr($totalAmount) }}</p>
    </div>

    @if(filled($purchaseOrder->acceptance_notes))
        <div class="notes-box">
            <p><strong>Supplier Notes:</strong></p>
            <p>{{ $purchaseOrder->acceptance_notes }}</p>
        </div>
    @endif

    <h2 style="font-size: 18px; margin-top: 30px;">Order Items</h2>
    <table>
        <thead>
        <tr>
            <th>Product</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Subtotal</th>
        </tr>
        </thead>
        <tbody>
        @foreach($purchaseOrder->purchaseOrderItems as $item)
            <tr>
                <td>{{ $item->productVariant->product->name }} ({{ $item->productVariant->value }})</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">{{ format_idr($item->unit_price) }}</td>
                <td class="text-right">{{ format_idr($item->quantity * $item->unit_price) }}</td>
            </tr>
        @endforeach
        </tbody>
        <tfoot>
        <tr>
            <td colspan="3" class="text-right"><strong>Total Amount:</strong></td>
            <td class="text-right"><strong>{{ format_idr($totalAmount) }}</strong></td>
        </tr>
        </tfoot>
    </table>

    <div style="text-align: center;">
        <a href="{{ $detailUrl }}" class="button">View Purchase Order</a>
    </div>

    <p>You can now proceed with the next steps in the procurement process.</p>

    <p>Best regards,<br>{{ config('app.name') }}</p>

    <div class="footer">
        © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.<br>
        This is an automated notification. Please do not reply to this email.
    </div>
</div>
</body>
</html>
