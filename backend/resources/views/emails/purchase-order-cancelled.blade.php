<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Purchase Order Cancelled - #{{ $purchaseOrder->purchase_order_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            color: #2d3748;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #718096;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
        .card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: #e53e3e;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background: #edf2f7;
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .text-right {
            text-align: right;
        }
        .cancelled-badge {
            background: #e53e3e;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .reason-box {
            background: #fff5f5;
            border-left: 4px solid #e53e3e;
            padding: 12px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
<div class="header">
    <strong>{{ config('app.name') }}</strong>
    <h1>Purchase Order Cancelled</h1>
    <span class="cancelled-badge">CANCELLED</span>
</div>

<p>Hello {{ $supplier->name }},</p>

<p>The following purchase order has been cancelled by {{ $cancelledBy->name }}:</p>

<div class="card">
    <p><strong>PO Number:</strong> #{{ $purchaseOrder->purchase_order_number }}</p>
    <p><strong>Order Date:</strong> {{ $purchaseOrder->created_at->format('F j, Y') }}</p>
    <p><strong>Cancelled At:</strong> {{ $purchaseOrder->cancelled_at->format('F j, Y H:i') }}</p>
    <p><strong>Total Amount:</strong> {{ format_idr($totalAmount) }}</p>
</div>

<div class="reason-box">
    <p><strong>Reason for Cancellation:</strong></p>
    <p>{{ $cancellationReason }}</p>
</div>

<h2 style="font-size: 18px; margin: 20px 0 10px;">Order Items</h2>
<table>
    <thead>
    <tr>
        <th>Product</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Sub Total</th>
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

<p>If you have any questions about this cancellation, please contact our support team.</p>

<p>Best regards,<br>{{ config('app.name') }}</p>

<div class="footer">
    © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
    <p>This is an automated notification. Please do not reply to this email.</p>
</div>
</body>
</html>
