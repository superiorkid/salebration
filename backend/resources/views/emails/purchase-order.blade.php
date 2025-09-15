<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Purchase Order #{{ $purchaseOrder->purchase_order_number }}</title>
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
            box-shadow: 0 0 4px rgba(0,0,0,0.05);
        }
        .header {
            text-align: center;
            color: #2d3748;
        }
        .header h1 {
            font-size: 22px;
            margin-bottom: 5px;
        }
        .card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .urgent {
            color: #e53e3e;
            font-weight: bold;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .table th {
            background: #edf2f7;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            text-align: left;
        }
        .table td {
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
            margin-top: 25px;
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
        <strong>{{ config('app.name') }}</strong>
        <h1>New Purchase Order</h1>
    </div>

    <p>Hello {{ $purchaseOrder->supplier->name }},</p>

    <p>A new purchase order has been created with the following details:</p>

    <div class="card">
        <p><strong>PO Number:</strong> #{{ $purchaseOrder->purchase_order_number }}</p>
        <p><strong>Created By:</strong> {{ $creator?->name ?? 'System' }}</p>
        <p><strong>Order Date:</strong> {{ $purchaseOrder->created_at->format('F j, Y') }}</p>
        <p><strong>Expected Delivery:</strong>
            @if($purchaseOrder->expected_at)
                <span class="urgent">{{ $purchaseOrder->expected_at->format('F j, Y') }}</span>
            @else
                Not specified
            @endif
        </p>
        <p><strong>Total Amount:</strong> {{ format_idr($totalAmount) }}</p>
    </div>

    <h2 style="font-size: 18px; margin-top: 30px;">Order Items</h2>
    <table class="table">
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
    </table>

    <div style="text-align: center;">
        <a href="{{ $detailUrl }}" class="button">View Full Purchase Order</a>
    </div>

    <p>Best regards,<br>{{ config('app.name') }}</p>

    @include('emails.components.footer')
</div>
</body>
</html>
