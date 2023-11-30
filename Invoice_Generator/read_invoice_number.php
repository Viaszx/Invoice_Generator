<?php
// Path to the invoice number file
$invoiceNumberFile = 'C:\xampp\htdocs\invoice_number';

// Read the current invoice number from the file
$currentInvoiceNumber = (int) file_get_contents($invoiceNumberFile);

// Sending the invoice number in the response to the request
echo $currentInvoiceNumber;
?>