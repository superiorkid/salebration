<?php

function format_idr(int $amount): string
{
    return 'Rp ' . number_format($amount, 0, ',', '.');
}

