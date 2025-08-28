from openpyxl import Workbook
from openpyxl.styles import Alignment

def writer_agent(data: list, file_path: str):
    wb = Workbook()
    ws = wb.active
    ws.title = "GST Report"

    # Reordered headers as requested
    headers = [
        "S.No.", "Vendor/Shop Name", "Date", "GSTIN", "Invoice No.", 
        "HSN Codes", "CGST", "SGST", "IGST", "Total Tax", "Taxable Amount"
    ]

    # Set optimal column widths for proper cell fitting
    column_widths = {
        'A': 8,   # S.No.
        'B': 30,  # Vendor/Shop Name
        'C': 15,  # Date
        'D': 18,  # GSTIN
        'E': 20,  # Invoice No.
        'F': 40,  # HSN Codes
        'G': 12,  # CGST
        'H': 12,  # SGST
        'I': 12,  # IGST
        'J': 12,  # Total Tax
        'K': 15   # Taxable Amount
    }

    # Apply column widths
    for col_letter, width in column_widths.items():
        ws.column_dimensions[col_letter].width = width

    # Create simple headers
    for col, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col)
        cell.value = header

    # Process data rows
    for row_idx, record in enumerate(data, start=2):
        # Serial number
        cell = ws.cell(row=row_idx, column=1)
        cell.value = row_idx - 1
        cell.alignment = Alignment(horizontal='center', vertical='center')
        
        # Clean shop name - replace line breaks with space for single line display
        shop_name = record.get("Shop Name", "N/A")
        if isinstance(shop_name, str):
            shop_name = shop_name.replace('\n', ' ').replace('\\n', ' ').strip()
        
        # Vendor/Shop Name with text wrapping (Column B)
        cell = ws.cell(row=row_idx, column=2)
        cell.value = shop_name
        cell.alignment = Alignment(wrap_text=True, vertical='center')
        
        # Date (Column C)
        cell = ws.cell(row=row_idx, column=3)
        date_value = record.get("Invoice Date", "N/A")
        if date_value in (None, "", "null", 0, 0.0):
            date_value = "N/A"
        cell.value = date_value
        cell.alignment = Alignment(vertical='center')
        
        # GSTIN (Column D)
        cell = ws.cell(row=row_idx, column=4)
        gstin_value = record.get("GSTIN", "N/A")
        if gstin_value in (None, "", "null", 0, 0.0):
            gstin_value = "N/A"
        cell.value = gstin_value
        cell.alignment = Alignment(vertical='center')
        
        # Invoice No. (Column E)
        cell = ws.cell(row=row_idx, column=5)
        invoice_value = record.get("Invoice Number", "N/A")
        if invoice_value in (None, "", "null", 0, 0.0):
            invoice_value = "N/A"
        cell.value = invoice_value
        cell.alignment = Alignment(vertical='center')
        
        # HSN Codes (Column F)
        hsn_codes = record.get("HSN Code", "N/A")
        cell = ws.cell(row=row_idx, column=6)
        
        if isinstance(hsn_codes, list):
            # Format as comma-separated in single line
            formatted_hsn = ", ".join(str(code) for code in hsn_codes if code)
            cell.value = formatted_hsn
        elif isinstance(hsn_codes, str) and "," in hsn_codes:
            formatted_hsn = ", ".join(code.strip() for code in hsn_codes.split(",") if code.strip())
            cell.value = formatted_hsn
        else:
            cell.value = hsn_codes if hsn_codes else "N/A"
            
        cell.alignment = Alignment(wrap_text=True, vertical='center')
        
        # Tax columns: CGST, SGST, IGST, Total Tax (Columns G, H, I, J)
        tax_data = [
            record.get("CGST", "N/A"),
            record.get("SGST", "N/A"),
            record.get("IGST", "N/A"),
            record.get("Tax Amount", "N/A")
        ]
        
        for col_idx, value in enumerate(tax_data, start=7):
            cell = ws.cell(row=row_idx, column=col_idx)
            if value in (None, "", "null", 0, 0.0):
                value = "N/A"
            cell.value = value
            cell.alignment = Alignment(vertical='center')
        
        # Taxable Amount (Column K)
        cell = ws.cell(row=row_idx, column=11)
        taxable_value = record.get("Total Amount", "N/A")
        if taxable_value in (None, "", "null", 0, 0.0):
            taxable_value = "N/A"
        cell.value = taxable_value
        cell.alignment = Alignment(vertical='center')
        
        # Set row height to accommodate wrapped text
        ws.row_dimensions[row_idx].height = 30

    # Set header row height
    ws.row_dimensions[1].height = 25

    wb.save(file_path)
    print(f"📝 Excel report saved to: {file_path}")