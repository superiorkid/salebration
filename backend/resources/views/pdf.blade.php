<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {{ $invoice->number }}</title>
    <style type="text/css">
        body {
            font-size: 12pt;
            line-height: 1.3;
            margin: 0;
            padding: 20px;
            color: #000;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .text-right {
            text-align: right;
        }
        .divider {
            border-top: 1px solid #000;
            margin: 15px 0;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10pt;
        }
    </style>
</head>
<body style="font-family: DejaVu Sans;">
<div class="header">
    <h1>Narmada Sentra Medica</h1>
    <p>Jl. diponogoro no.1</p>
    <p>Phone: +625615425456</p>
</div>

<div class="divider"></div>

<p><strong>Invoice No:</strong> {{ $invoice->number }}</p>
<p><strong>Date:</strong> {{ $invoice->created_at->format('Y-m-d H:i') }}</p>
<p><strong>Operator:</strong> {{ $invoice->sale->operator->name }}</p>

<div class="divider"></div>

<table>
    <thead>
    <tr>
        <th>Item</th>
        <th>Qty</th>
        <th class="text-right">Price</th>
        <th class="text-right">Subtotal</th>
    </tr>
    </thead>
    <tbody>
    @foreach($invoice->sale->items as $item)
        <tr>
            <td>{{ $item->productVariant->product->name }} - {{ $item->productVariant->value }}</td>
            <td>{{ $item->quantity }}</td>
            <td class="text-right">{{ number_format($item->price, 0, ',', '.') }}</td>
            <td class="text-right">{{ number_format($item->subtotal, 0, ',', '.') }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<div class="divider"></div>

<table>
    <tr>
        <td><strong>Subtotal</strong></td>
        <td class="text-right">{{ number_format($invoice->sale->total, 0, ',', '.') }}</td>
    </tr>
    <tr>
        <td><strong>Total</strong></td>
        <td class="text-right">{{ number_format($invoice->sale->total, 0, ',', '.') }}</td>
    </tr>
    <tr>
        <td><strong>Paid</strong></td>
        <td class="text-right">{{ number_format($invoice->sale->paid, 0, ',', '.') }}</td>
    </tr>
    <tr>
        <td><strong>Change</strong></td>
        <td class="text-right">{{ number_format($invoice->sale->change, 0, ',', '.') }}</td>
    </tr>
    <tr>
        <td><strong>Payment Method</strong></td>
        <td class="text-right">{{ $invoice->sale->payments[0]->method }}</td>
    </tr>
</table>

<div class="divider"></div>

<div class="footer">
    <p>Thank you for shopping with us</p>
    <p>Returns accepted within 7 days with receipt.</p>
</div>
</body>
</html>
