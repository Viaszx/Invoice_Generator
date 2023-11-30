<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["pdfFile"])) {
    // The path to the folder where you want to save the file
    $uploadDirectory = "C:/xampp/htdocs/pdf_files/."

    // Generate a unique file name based on the passed data
    $invoiceNumber = $_POST["invoiceNumber"];
    $billToName = $_POST["billToName"];
	$formattedInvoiceNumber = $_POST["formattedInvoiceNumber"];

    // Get file name from FormData
    $fileName = $_FILES["pdfFile"]["name"];

    // Add the current date and time to the file name in MMDDYYYY_HHMM format
    $currentDateTime = date("mdYY_His");

	// Check the condition and form the file name accordingly
    if ($invoiceNumber !== $formattedInvoiceNumber) {
        $fileNameWithDate = "${currentDateTime}_Manual_Invoice_${invoiceNumber}_BillTo_${billToName}.pdf";
    } else {
        $fileNameWithDate = "${currentDateTime}_Invoice_${formattedInvoiceNumber}_BillTo_${billToName}.pdf"
    }

    // Full path to the file on the server
    $filePath = $uploadDirectory . $fileNameWithDate;

    // Move the uploaded file to the specified folder
    if (move_uploaded_file($_FILES["pdfFile"]["tmp_name"], $filePath)) {
        echo "The file was successfully saved as $fileNameWithDate."
    } else {
        echo "Error while saving the file."
    }
} else {
    echo "Invalid request."
}
?>