# Invoice Generator
***
A simple web-based invoice generator.

## User interface
![web_interface](https://github.com/Viaszx/Mazda-SkyActiv-EngineCoolantTemp/assets/78595419/603cec75-dff7-4850-93fb-303bf4e81a0c)

## Functionality

- **Add item:** Add items to your invoice by entering the appropriate information in the user interface.

- **View or Download:** View or download the generated invoice. When you download, the invoice is saved on the server and the unique invoice number will automatically increment.

- **Tax and Discount:** Performs calculations by taking into account additional parameters such as tax and discount.

## Project Files

| File                   | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| index.html         | The main HTML file for the user interface.                 |
| script.js          | JavaScript script to control interaction with the interface.|
| pdfmake.min.js     | A pdfmake library for generating PDF documents.             |
| invoice_number.php | PHP script to generate a unique invoice number.             |
| save_pdf.php       | PHP script to save the generated PDF invoice.               |
| read_invoice_number.php | PHP script to read invoice number from the database.    |
| styles.css        | Styles file to give the appearance of the user interface.   |


## How to use

1. Make sure you have [XAMPP](https://www.apachefriends.org/index.html) or a similar server installed.
2. Copy all project files to the web server directory (e.g. `htdocs` for XAMPP).
3. Start XAMPP and enable the Apache server.
4. Open a web browser and type `http://localhost/index.html`.
5. Enter the required information to generate the invoice and save the PDF.

## Requirements

- Web browser that supports JavaScript.
- [XAMPP](https://www.apachefriends.org/index.html) or a similar local server.

## Example of generated PDF
![pdf](https://github.com/Viaszx/Mazda-SkyActiv-EngineCoolantTemp/assets/78595419/cbc9f7e0-1808-4dcc-a054-b16029bd3757)

