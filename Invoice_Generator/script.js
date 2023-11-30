let invoiceDateValue; // Declare a variable for invoiceDate value
let paymentDueValue; // Declare a variable for paymentDue value
let subtotalValueText; // Declare a global variable to store the value of subtotalValue
let taxAmountValueText; 
let discountValueText; 
let totalValueText;
// Load current invoice number from file or set to 0
let currentInvoiceNumber = 0;
let formattedInvoiceNumber = "0"; // Declare as a string
let modifiedInvoiceNumber = 0;

document.addEventListener("DOMContentLoaded", function () {
	// Call the function to get the current invoice number and set it in the input field
	getCurrentInvoiceNumber();
	
	// Get the input element for the invoice number
const invoiceNumberInput = document.getElementById("invoiceNumber");

// Add a handler for the event of changing the value in the input
invoiceNumberInput.addEventListener("change", function () {
    // Get a new value from input
    const newInvoiceNumber = invoiceNumberInput.value;

    // Check if the new value differs from the current invoice number
    if (newInvoiceNumber !== formattedInvoiceNumber) {
		 console.log("Changed invoice number:", newInvoiceNumber);
        // If the value is different, update the modified invoice number
        modifiedInvoiceNumber = newInvoiceNumber;
    }
    // Otherwise, leave the modified number unchanged
});

	// Substitute the current date into the "Invoice Date" field with UTC taken into account
	const invoiceDateInput = document.getElementById("invoiceDate");
	// Function for setting the date of invoice creation
	function setInvoiceDate() {
	const invoiceDateInput = document.getElementById("invoiceDate");
	const today = new Date();
	const formattedDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().substr(0, 10);
	invoiceDateInput.value = formattedDate;
		}
	// Sets the invoice creation date
	setInvoiceDate();
  // Substitute the date 1 month more in the "Payment Due" field
  const paymentDueInput = document.getElementById("PaymentDue");
  setPaymentDueDate(); // Call the function to set the Payment Due value on page load

  invoiceDateInput.addEventListener("change", function () {
    setPaymentDueDate(); // Call the function to update the Payment Due value when Invoice Date changes
  });

  // Track changes in the "Tax information" field
  const taxInformationInput = document.getElementById("taxInformation");
  taxInformationInput.addEventListener("change", function () {
    // Make sure that the value is within the valid range
    let taxValue = parseFloat(taxInformationInput.value);
    if (isNaN(taxValue) || taxValue < 0) {
      taxValue = 0;
    } else if (taxValue > 100) {
      taxValue = 100;
    }
    // Round to 2 decimal places
    taxValue = taxValue.toFixed(2);
    taxInformationInput.value = taxValue;
  });

	// Get the parent container for Items
	const itemsContainerValue = document.querySelector(".items-container");
	// Add an input event handler for the entire container
	itemsContainerValue.addEventListener("input", function (event) {
		const inputField = event.target;
		const fieldName = getInputFieldName(inputField);

		if (fieldName) {
			validatePositiveNumber(inputField, fieldName);
			calculateInvoiceTotal();
		}
	});
	// Get all the Qty, Rate, and Discount fields
	function getInputFieldName(inputField) {
		const className = inputField.classList[0];
		if (className.startsWith("itemQty")) {
			return "Qty";
		} else if (className.startsWith("itemRate")) {
			return "Rate";
		} else if (className.startsWith("itemDiscount")) {
			return "Discount";
		}
		return null;
	}

	function validatePositiveNumber(inputField, fieldName) {
		let value = inputField.value;

		// Remove zeros at the beginning of the value
		if (fieldName === 'Rate' || fieldName === 'Discount') {
			value = value.replace(/^0+/, '');
		}

		value = parseFloat(value);

		if (fieldName === 'Qty' && (isNaN(value) || value < 1)) {
			// If Qty is not a positive number greater than or equal to 1
			alert(`Qty must be a number greater than or equal to 1.`);
			inputField.value = '1'; // Set the default value to 1
		} else if ((fieldName === 'Rate' || fieldName === 'Discount') && isNaN(value)) {
			// If Rate or Discount is not a number
			alert(`${fieldName} should be a number.`);
			inputField.value = ''; // Clear the field
		} else if (value < 0) {
			// If a negative number is entered, print an error message
			alert(`Enter a positive number for the field ${fieldName}.`);
			inputField.value = ''; // Clear the field
		}
	}

    // Ability to add new Items
    const addItemButton = document.getElementById("addItem");
    const itemsContainer = document.querySelector(".items-container");
    addItemButton.addEventListener("click", function () {
        const itemTemplate = document.querySelector(".item-template");
        const newItem = itemTemplate.cloneNode(true);
        newItem.classList.remove("item-template");
        itemsContainer.insertBefore(newItem, addItemButton); // Insert newItem before the "Add item" button

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add("item-delete");
        deleteButton.textContent = "Delete";
        newItem.appendChild(deleteButton);
		
		calculateInvoiceTotal(); // Call the function to recalculate the total amount after adding a new item
    });

    // Ability to delete Items
    itemsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("item-delete")) {
            const item = event.target.closest(".item");
            item.remove();
            calculateInvoiceTotal(); // Recalculate Total after deleting an item
        }
    });

  // Processing of "Rate" field changes for Subtotal and Total recalculation
  const invoiceForm = document.getElementById("invoiceForm");
  invoiceForm.addEventListener("change", function () {
    calculateInvoiceTotal();
  });

  // Call the function on page load to substitute default values
  calculateInvoiceTotal();
  
  // For example, adding a listener to an element after loading the DOM:
  const expandableLegend = document.querySelector('.expandable-legend');
  if (expandableLegend) {
    expandableLegend.addEventListener("click", toggleInformation);
  }
// For example, adding a listener to an element after loading the DOM:
const billToToggle = document.querySelector('#billToToggle');
if (billToToggle) {
    billToToggle.addEventListener("click", toggleBillTo);
}
// For example, adding a listener to an element after loading the DOM:
const invoiceToggle = document.querySelector('#invoiceToggle');
if (invoiceToggle) {
    invoiceToggle.addEventListener("click", toggleInvoice);
}

    // Define a function to handle pressing the "downloadInvoice" and "viewInvoice" buttons
	function handleInvoiceButtonClick(event) {
		const getInvoiceNumber = document.getElementById("invoiceNumber").value;
        const billToName = document.getElementById("billToName").value;
		const billTocompanyName = document.getElementById("billTocompanyName").value;
		const billToaddress = document.getElementById("billToaddress").value;
		const billTophone = document.getElementById("billTophone").value;
		const billToemail = document.getElementById("billToemail").value;

		const taxInformation = document.getElementById("taxInformation").value;
		
		// Get all <input> elements with class 'itemDate'
		const itemDateInputs = document.querySelectorAll('.itemDate');

		// Get all <input> elements with class 'itemRate'
		const itemRateInputs = document.querySelectorAll('.itemRate');

		// Check that at least one of the fields 'itemDate' or 'itemRate' is empty
		let hasEmptyItemDate = false;
		let hasEmptyItemRate = false;

		itemDateInputs.forEach((itemDateInput) => {
			const itemDateValue = itemDateInput.value;
			if (!itemDateValue) {
				hasEmptyItemDate = true;
				return; // If at least one 'itemDate' field is empty, exit the loop
			}
		});

		itemRateInputs.forEach((itemRateInput) => {
			const itemRateValue = itemRateInput.value;
			if (!itemRateValue) {
				hasEmptyItemRate = true;
				return; // If at least one 'itemRate' field is empty, exit the loop
			}
		});

		if (!billToName || hasEmptyItemDate || hasEmptyItemRate || !getInvoiceNumber) {
			let errorMessage = "Please fill in the following fields: ";
			if (!getInvoiceNumber) {
				errorMessage += "\nInvoice Details: Invoice #, ";
			}
			if (!billToName) {
				errorMessage += "\nBill to: Name*, ";
			}
			if (hasEmptyItemDate) {
				errorMessage += "\nItem: Date*, "; // Add check for itemDate
			}
			    if (hasEmptyItemRate) {
				errorMessage += "\nItem: Rate*, "; // Add check for itemRate
			}			
			errorMessage = errorMessage.slice(0, -2); // Remove the last comma and space

			alert(errorMessage);
			return;
		}

        // Getting the current date in the format MM/DD/YYYY
        function getCurrentDate() {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            return `${month}/${day}/${year}`;
        }

        // Function for creating and formatting rows for the table with goods
        function createItemRow(date, itemName, description, qty, rate, subtotal, discount, tax, amount) {
            return [date, itemName, description, qty, rate, subtotal, discount, tax, amount];
        }

	// Collect data from the form
	const items = [];
	//const itemDateInputs = document.querySelectorAll('.itemDate');
	const itemNameInputs = document.querySelectorAll('.itemName');
	const itemDescriptionInputs = document.querySelectorAll('.itemDescription');
	const itemQtyInputs = document.querySelectorAll('.itemQty');
	//const itemRateInputs = document.querySelectorAll('.itemRate');
	const itemDiscountInputs = document.querySelectorAll('.itemDiscount');
	const itemTaxableInputs = document.querySelectorAll('.itemTaxable');
	const taxInput = document.getElementById("taxInformation");
	let taxValue = parseFloat(taxInput.value);

itemDateInputs.forEach((itemDateInput, index) => {
    const date = itemDateInput.value;
    const itemName = itemNameInputs[index].value;
    const description = itemDescriptionInputs[index].value;
    const qty = itemQtyInputs[index].value;
    const rate = itemRateInputs[index].value;
    const discount = itemDiscountInputs[index].value;
    const taxable = itemTaxableInputs[index].checked;

    // Calculate tax for the current product
    const itemTax = (taxable ? (rate * qty * (taxValue / 100)) : 0);
	// Round the tax value to two decimal places
	const roundedTax = itemTax.toFixed(2);
	// Round the Subtotal value to two decimal places
	const roundedSubtotal = (parseFloat(rate) * parseFloat(qty)).toFixed(2);
    // Format the discount value depending on its value
	const formattedDiscount = (parseFloat(discount) === 0 ? "$0.00" : `-$${parseFloat(discount).toFixed(2)}`);
	const formattedAmount = (parseFloat(rate * qty) - parseFloat(discount) + parseFloat(roundedTax)).toFixed(2);
	const roundedRate = parseFloat(rate).toFixed(2);
	
    // Add a string for the product to the items array
	 items.push(createItemRow(
		{ text: formatDate(date), fontSize: 10 },
		{ text: itemName, fontSize: 10 },
		{ text: description, fontSize: 10 },
		{ text: qty, fontSize: 10 },
		{ text: `$${roundedRate}`, fontSize: 10 },
		{ text: `$${roundedSubtotal}`, fontSize: 10 },
		{ text: formattedDiscount, fontSize: 10 },
		{ text: `$${roundedTax}`, fontSize: 10 },
		{ text: `$${formattedAmount}`, fontSize: 10 }
	));
});

		// Define indentation and styles based on checkbox state
		const nameMargin = [10, 3, 0, 0];
		const valueMargin = [10, 0, 0, 0];
		const boldStyle = { bold: true };
		const regularStyle = {};

const docDefinition = {
    content: [
        {
            table: {
                widths: ['*', '*'], // Two cells, each occupying 50% of the width
                body: [
                    [
                        { text: 'Company  Name', fontSize: 20, bold: true, margin: [10, 0, 0, 0], color: '#888888' },
                        { text: 'INVOICE', fontSize: 16, bold: true, alignment: 'right', margin: [0, 0, 10, 0], color: '#888888' }
                    ],
                    [
                        { text: 'Your Name', fontSize: 18, bold: true, margin: [10, 0, 0, 0] },
                        { text: invoiceNumberInput.value !== formattedInvoiceNumber ? '# ' + invoiceNumberInput.value : '# ' + formattedInvoiceNumber, fontSize: 14, bold: true, alignment: 'right', margin: [0, 0, 10, 0] }
                    ]
                ]
            },
            layout: 'noBorders'
        },
        { text: homeAddressCheckbox.checked ? 'Address:' : '', fontSize: 10, ...boldStyle, margin: nameMargin, color: '#888888' },
        { text: homeAddressCheckbox.checked ? (homeAddressCheckbox.checked ? homeAddress.value : '') : '', fontSize: 10, ...regularStyle, margin: valueMargin },
        { text: phoneCellCheckbox.checked ? 'Phone:' : '', fontSize: 10, ...boldStyle, margin: nameMargin, color: '#888888' },
        { text: phoneCellCheckbox.checked ? (phoneCellCheckbox.checked ? phoneCell.value : '') : '', fontSize: 10, ...regularStyle, margin: valueMargin },
        { text: paypalCheckbox.checked ? 'Paypal:' : '', fontSize: 10, ...boldStyle, margin: nameMargin, color: '#888888' },
        { text: paypalCheckbox.checked ? (paypalCheckbox.checked ? paypal.value : '') : '', fontSize: 10, ...regularStyle, margin: valueMargin },
        { text: zelleCheckbox.checked ? 'Zelle:' : '', fontSize: 10, ...boldStyle, margin: nameMargin, color: '#888888' },
        { text: zelleCheckbox.checked ? (zelleCheckbox.checked ? zelle.value : '') : '', fontSize: 10, ...regularStyle, margin: valueMargin },
		{ text: venmoCheckbox.checked ? 'Venmo:' : '', fontSize: 10, ...boldStyle, margin: nameMargin, color: '#888888' },
        { text: venmoCheckbox.checked ? (venmoCheckbox.checked ? venmo.value : '') : '', fontSize: 10, ...regularStyle, margin: valueMargin },
        { text: accountNumberCheckbox.checked ? 'Account Number:' : '', fontSize: 10, ...boldStyle, margin: nameMargin, color: '#888888' },
        { text: accountNumberCheckbox.checked ? (accountNumberCheckbox.checked ? accountNumber.value : '') : '', fontSize: 10, ...regularStyle, margin: valueMargin },
        {
            columns: [
                [
                    { text: 'BILL TO', fontSize: 10, bold: true, margin: [10, 20, 0, 0] },
                    { text: 'Name:', fontSize: 10, bold: true, margin: [10, 0, 0, 0], color: '#888888' },
                    { text: billToName, fontSize: 10, margin: [10, 0, 0, 0] },
                    { text: billTocompanyName ? 'Company name:' : '', fontSize: 10, bold: true, margin: [10, 1, 0, 0], color: '#888888' },
                    { text: billTocompanyName ? billTocompanyName : '', fontSize: 10, margin: [10, 0, 0, 0] },
                    { text: billToaddress ? 'Address:' : '', fontSize: 10, bold: true, margin: [10, 1, 0, 0], color: '#888888' },
                    { text: billToaddress ? billToaddress : '', fontSize: 10, margin: [10, 0, 0, 0] },
                    { text: billTophone ? 'Phone:' : '', fontSize: 10, bold: true, margin: [10, 1, 0, 0], color: '#888888' },
                    { text: billTophone ? billTophone : '', fontSize: 10, margin: [10, 0, 0, 0] },
                    { text: billToemail ? 'Email:' : '', fontSize: 10, bold: true, margin: [10, 1, 0, 0], color: '#888888' },
                    { text: billToemail ? billToemail : '', fontSize: 10, margin: [10, 0, 0, 0] },
                ],
                [
                    { text: "Invoice # " + getInvoiceNumber, fontSize: 12, bold: true, margin: [0, 20, 0, 0], alignment: 'right' },
                    { text: "Invoice Date: " + formatDate(invoiceDateValue), fontSize: 12, margin: [0, 0, 0, 0], alignment: 'right' },
                    { text: "Payment Due: " + formatDate(paymentDueValue), fontSize: 12, margin: [0, 0, 0, 0], alignment: 'right' },
                ]
            ]
        },
        { text: " ", fontSize: 8, margin: [0, 0, 0, 0], alignment: 'right' },
        {
            style: 'table',
            table: {
				pageBreak: 'avoid',
				noWrap: false, // Allow word transfer
                headerRows: 1,
                widths: ['auto', 60, 80, 28, 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                    [
						{ text: 'Date', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Item name', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Description', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Qty *', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Rate *', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Subtotal', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Discount', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Tax', style: 'tableHeader', fillColor: '#CCCCCC' },
						{ text: 'Amount', style: 'tableHeader', fillColor: '#CCCCCC' }
					],
                    ...items, // Add rows for products
                ]
            }
        },
        { text: 'Subtotal', fontSize: 12, bold: true, margin: [0, 10, 0, 0], alignment: 'right', color: '#888888' },
        { text: subtotalValueText, fontSize: 12, margin: [0, 0, 40, 0], alignment: 'right' },
        {
		text: taxAmountValueText === "$0.00" ? 'Tax 0.0%' : `Tax ` + taxInformation + '%',
		fontSize: 12,
		bold: true,
		margin: [0, 0, 0, 0],
		alignment: 'right',
		color: '#888888'
		},
        { text: taxAmountValueText, fontSize: 12, margin: [0, 0, 40, 0], alignment: 'right' },
        { text: 'Discount', fontSize: 12, bold: true, margin: [0, 0, 0, 0], alignment: 'right', color: '#888888' },
        { text: discountValueText, fontSize: 12, margin: [0, 0, 40, 0], alignment: 'right' },
        { text: 'Total Due', fontSize: 12, bold: true, margin: [0, 0, 0, 0], alignment: 'right'},
        { text: totalValueText, fontSize: 12, margin: [0, 0, 40, 0], alignment: 'right' },
    ],
    footer: {
        text: "Thank you for choosing me!",
        alignment: "center",
        fontSize: 10
    },
    styles: {
        tableHeader: {
            bold: true,
            fontSize: 12,
            fillColor: '#f2f2f2',
            alignment: 'center'
        }
    }
};

        // Create PDF document
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);

        // Download PDF file
		// Generate PDF document and define file name for downloading
		const fileName = invoiceNumberInput.value !== formattedInvoiceNumber
			? `Invoice_${invoiceNumberInput.value}_BillTo_${billToName}.pdf` // Manual
			: `Invoice_${formattedInvoiceNumber}_BillTo_${billToName}.pdf`;

		// If the number on the form is different from the number in the file, pass the number from the field to currentInvoice
		const currentInvoice = invoiceNumberInput.value !== formattedInvoiceNumber
			? invoiceNumberInput.value
			: formattedInvoiceNumber;
			
		// Load PDF document with correct file name
		pdfDocGenerator.download(fileName);
	
		if (event.target.id === "downloadInvoice") {
			const invoiceForm = document.getElementById('invoiceForm');

		pdfDocGenerator.getBlob((blob) => {
			const formData = new FormData();
			formData.append("invoiceNumber", currentInvoice); // Value of invoice number after condition
			formData.append("billToName", billToName); // Name value
			formData.append("formattedInvoiceNumber", formattedInvoiceNumber); // Invoice number value from the file

			// Generate the file name depending on the difference between invoiceNumberInput and formattedInvoiceNumber
			const fileName = currentInvoice !== formattedInvoiceNumber
				? `Manual_Invoice_${currentInvoice}_BillTo_${billToName}.pdf`
				: `Invoice_${formattedInvoiceNumber}_BillTo_${billToName}.pdf`;

			formData.append("pdfFile", blob, fileName);

			// Create a request to the server to send the file
			fetch("http://127.0.0.1/save_pdf.php", {
				method: "POST",
				body: formData,
			})
			.then((response) => response.text())
			.then((result) => {
				console.log(result); // Output the result to the console
			})
			.catch((error) => {
				console.error(error); // Output the error to the console
			});
		});
		
		// 
		const itemsContainer = document.querySelector(".items-container");
		const items = itemsContainer.querySelectorAll(".item:not(.item-template)");
		items.forEach(function (item) {
			item.remove();
		});
		
           // Update and save invoice number
            updateInvoiceNumber()
                .then((newInvoiceNumber) => {                    
                    // Reset form
                    const form = document.getElementById("invoiceForm");
                    form.reset();

                    // Set the date and recalculate the total amount and display the new invoice number
					getCurrentInvoiceNumber();
                    setInvoiceDate();
                    setPaymentDueDate();
                    calculateInvoiceTotal();
                })
                .catch((error) => {
                    console.error(error);
                });
		}

        // Display invoice information on the page (at your discretion)
        // ...
    }
	// Event handlers for the "downloadInvoice" and "viewInvoice" buttons,
// which call the function handleInvoiceButtonClick
document.getElementById("downloadInvoice").addEventListener("click", handleInvoiceButtonClick);
document.getElementById("viewInvoice").addEventListener("click", handleInvoiceButtonClick);
});
// Function for updating the invoice number
function updateInvoiceNumber() {
    return fetch('http://127.0.0.1/invoice_number.php')
        .then(response => response.text())
        .then(newInvoiceNumber => {
            currentInvoiceNumber = parseInt(newInvoiceNumber, 10);
            console.log("New invoice number:", currentInvoiceNumber);
            return String(currentInvoiceNumber).padStart(6, '0');
        })
        .catch(error => {
            console.error("Error when getting a new invoice number: ", error);
            return ""; // Return empty string in case of error
        });
}
// Function for obtaining the current invoice number and setting it in the input field
function getCurrentInvoiceNumber() {
    fetch('http://127.0.0.1/read_invoice_number.php')
        .then(response => response.text())
        .then(currentInvoiceNumber => {
			currentInvoiceNumber = parseInt(currentInvoiceNumber, 10);
            formattedInvoiceNumber = String(currentInvoiceNumber).padStart(6, '0'); // Formatting with leading zeros
            // The variable formattedInvoiceNumber will contain the current invoice number
            console.log("Current invoice number:", formattedInvoiceNumber);

            // Set the current invoice number in the input field
            const invoiceNumberInput = document.getElementById("invoiceNumber");
            invoiceNumberInput.value = formattedInvoiceNumber.padStart(6, '0');
        })
        .catch(error => {
            console.error("Error while getting current invoice number:", error);
        });
}
// Function for converting date to format MM/DD/YYYY
function formatDate(inputDate) {
	    if (!inputDate) {
        return "N/A";
    }
    const dateParts = inputDate.split('-'); // Split the string into parts by separator "-"
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    
    // Convert the parts back to a string and format them
    return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
}

// Function for hiding block Information
function toggleInformation() {
  const hiddenInformation = document.querySelector('.hidden-information');
  const expandableLegend = document.querySelector('.expandable-legend');

  if (hiddenInformation) {
    if (hiddenInformation.classList.contains('hidden')) {
      hiddenInformation.classList.remove('hidden');
      expandableLegend.textContent = 'Requisites: ▲';
      //console.log('Information opened'); // Output a message to the console on opening
    } else {
      hiddenInformation.classList.add('hidden');
      expandableLegend.textContent = 'Requisites: ▼';
      //console.log('Information closed'); // Output a message to the console on closing
    }
  }
}
// Function for hiding/displaying the Bill to block
function toggleBillTo() {
    const hiddenBillTo = document.querySelector('#hiddenBillTo');
    const billToToggle = document.querySelector('#billToToggle');

    if (hiddenBillTo) {
        if (hiddenBillTo.classList.contains('hidden')) {
            hiddenBillTo.classList.remove('hidden');
            billToToggle.textContent = 'Bill to: ▲';
            //console.log('Bill to opened'); // Output a message to the console on opening
        } else {
            hiddenBillTo.classList.add('hidden');
            billToToggle.textContent = 'Bill to: ▼';
            //console.log('Bill to closed'); // Output a message to the console on closing
        }
    }
}
// Function for hiding/displaying the Invoice Details block
function toggleInvoice() {
    const hiddenInvoice = document.querySelector('#hiddenInvoice');
    const invoiceToggle = document.querySelector('#invoiceToggle');

    if (hiddenInvoice) {
        if (hiddenInvoice.classList.contains('hidden')) {
            hiddenInvoice.classList.remove('hidden');
            invoiceToggle.textContent = 'Invoice Details: ▲';
            //console.log('Invoice Details opened'); // Output a message to the console on opening
        } else {
            hiddenInvoice.classList.add('hidden');
            invoiceToggle.textContent = 'Invoice Details: ▼';
            //console.log('Invoice Details closed'); // Output a message to the console on closing
        }
    }
}

// Function for setting the payment deadline date
function setPaymentDueDate() {
	  const invoiceDateInput = document.getElementById("invoiceDate");
	  const paymentDueInput = document.getElementById("PaymentDue");
	  const invoiceDate = new Date(invoiceDateInput.value);
	  const paymentDueDate = new Date(invoiceDate);
	  paymentDueDate.setMonth(paymentDueDate.getMonth() + 1);
	  const formattedPaymentDueDate = paymentDueDate.toISOString().substr(0, 10);
	  paymentDueInput.value = formattedPaymentDueDate;
	  
	       // Assign values to variables
    invoiceDateValue = invoiceDateInput.value;
    paymentDueValue = formattedPaymentDueDate;
	}

// Function for calculating the total amount
function calculateInvoiceTotal() {
    const itemRates = document.querySelectorAll(".itemRate");
    const itemDiscounts = document.querySelectorAll(".itemDiscount");
    const itemQtys = document.querySelectorAll(".itemQty");
    const itemTaxables = document.querySelectorAll(".itemTaxable");

    let subtotal = 0;
    let discount = 0; // Initialize variable for discount
    let taxAmount = 0; // Initialize variable for tax amount

    itemRates.forEach((rateInput, index) => {
        const rate = parseFloat(rateInput.value);
        const qty = parseInt(itemQtys[index].value);
        const discountValue = parseFloat(itemDiscounts[index].value);
        const isTaxable = itemTaxables[index].checked;

        if (!isNaN(rate) && !isNaN(qty)) {
            subtotal += rate * qty; // Multiply Rate by Qty
            if (!isNaN(discountValue)) {
                discount += discountValue; // Summarize the discount for each product
            }
            if (isTaxable) {
                const taxInformationInput = document.getElementById("taxInformation");
                let taxRate = parseFloat(taxInformationInput.value);
                if (isNaN(taxRate)) {
                    taxRate = 0;
                }
                taxAmount += (rate * qty * (taxRate / 100)); // Multiply tax by Rate and Qty
            }
        }
    });

    const total = (subtotal + taxAmount - discount).toFixed(2); // Subtract the discount and add the tax to the total amount

    // Update values inside span elements
    const subtotalValueSpan = document.getElementById("subtotalValue");
	subtotalValueText = "$" + subtotal.toFixed(2);
    const taxAmountValueSpan = document.getElementById("taxAmountValue");
	taxAmountValueText = "$" + taxAmount.toFixed(2);
    const discountValueSpan = document.getElementById("discountValue");
	discountValueText = "-$" + discount.toFixed(2);
    const totalValueSpan = document.getElementById("totalValue");
	totalValueText = "$" + total;

    subtotalValueSpan.textContent = "$" + subtotal.toFixed(2);
    taxAmountValueSpan.textContent = "$" + taxAmount.toFixed(2);
    discountValueSpan.textContent = "-$" + discount.toFixed(2);
    totalValueSpan.textContent = "$" + total;
}
