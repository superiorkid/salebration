<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Purchase Order #{{ $purchaseOrder->id }} Received</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .detail-row {
            margin-bottom: 8px;
        }
        .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 120px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .items-table th {
            background-color: #f2f2f2;
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #ddd;
        }
        .items-table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-row {
            font-weight: bold;
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>Purchase Order Received</h1>
</div>

<div class="content">
    <p>Dear {{ $purchaseOrder->supplier->name }},</p>

    <p>We have successfully received all items for the following purchase order:</p>

    <div class="details">
        <div class="detail-row">
            <span class="detail-label">PO Number:</span>
            <span>#{{ $purchaseOrder->id }}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span>{{ $purchaseOrder->created_at->format('F j, Y') }}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Received Date:</span>
            <span>{{ $purchaseOrder->received_at->format('F j, Y') }}</span>
        </div>
    </div>

    <h3>Items Received:</h3>
    <table class="items-table">
        <thead>
        <tr>
            <th>No</th>
            <th>Item Description</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Unit Price</th>
            <th class="text-right">Total</th>
        </tr>
        </thead>
        <tbody>
        @foreach($purchaseOrder->purchaseOrderItems as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    {{ $item->productVariant->product->name }}<br>
                    <small>{{ $item->productVariant->value }}</small>
                </td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">{{ format_idr($item->unit_price) }}</td>
                <td class="text-right">{{ format_idr($item->quantity * $item->unit_price) }}</td>
            </tr>
        @endforeach
        <tr class="total-row">
            <td colspan="4" class="text-right">Grand Total:</td>
            <td class="text-right">{{ format_idr($totalAmount) }}</td>
        </tr>
        </tbody>
    </table>

    <p>Please review the items above and contact us if there are any discrepancies.</p>
</div>

<div class="footer">
    <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    <p>This is an automated message - please do not reply directly to this email.</p>
</div>
</body>
</html>
