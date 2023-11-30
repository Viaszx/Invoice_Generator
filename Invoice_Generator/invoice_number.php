<?php
// Path to the invoice number file
$invoiceNumberFile = 'C:\xampp\htdocs\invoice_number';

// Read the current invoice number from the file
$currentInvoiceNumber = (int) file_get_contents($invoiceNumberFile);

// Increase the invoice number by 1
$currentInvoiceNumber++;

// Saving the updated invoice number to a file
file_put_contents($invoiceNumberFile, $currentInvoiceNumber);

// Sending the invoice number in the response to the request
echo $currentInvoiceNumber;
?>
