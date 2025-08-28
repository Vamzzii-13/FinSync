from openpyxl import Workbook
from openpyxl.styles import Alignment

def writer_agent(data: list, file_path: str):
    wb = Workbook()
    ws = wb.active
    ws.title = "GST Report"

    # Simple headers
    headers = [
        "S.No.", "Vendor/Shop Name", "GSTIN", "Invoice No.", "Date", 
        "Taxable Amount", "Total Tax", "CGST", "SGST", "IGST", "HSN Codes"
    ]

    # Set optimal column widths for proper cell fitting
    column_widths = {
        'A': 8,   # S.No.
        'B': 30,  # Vendor/Shop Name (increased for long names)
        'C': 18,  # GSTIN
        'D': 20,  # Invoice No.
        'E': 15,  # Date (increased for datetime)
        'F': 15,  # Taxable Amount
        'G': 12,  # Total Tax
        'H': 12,  # CGST
        'I': 12,  # SGST
        'J': 12,  # IGST
        'K': 40   # HSN Codes (increased for multiple codes)
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
        
        # Vendor/Shop Name with text wrapping
        cell = ws.cell(row=row_idx, column=2)
        cell.value = shop_name
        cell.alignment = Alignment(wrap_text=True, vertical='center')
        
        # Other data columns
        row_data = [
            record.get("GSTIN", "N/A"),
            record.get("Invoice Number", "N/A"),
            record.get("Invoice Date", "N/A"),
            record.get("Total Amount", "N/A"),
            record.get("Tax Amount", "N/A"),
            record.get("CGST", "N/A"),
            record.get("SGST", "N/A"),
            record.get("IGST", "N/A")
        ]
        
        # Fill data cells (columns 3-10)
        for col_idx, value in enumerate(row_data, start=3):
            cell = ws.cell(row=row_idx, column=col_idx)
            # Clean and format values
            if value in (None, "", "null", 0, 0.0):
                value = "N/A"
            cell.value = value
            cell.alignment = Alignment(vertical='center')
        
        # Handle HSN Codes with proper formatting
        hsn_codes = record.get("HSN Code", "N/A")
        cell = ws.cell(row=row_idx, column=11)
        
        if isinstance(hsn_codes, list):
            # Format as comma-separated in single line
            formatted_hsn = ", ".join(str(code) for code in hsn_codes if code)
            cell.value = formatted_hsn
        elif isinstance(hsn_codes, str) and "," in hsn_codes:
            formatted_hsn = ", ".join(code.strip() for code in hsn_codes.split(",") if code.strip())
            cell.value = formatted_hsn
        else:
            cell.value = hsn_codes if hsn_codes else "N/A"
            
        # Enable text wrapping for HSN codes cell to handle long content
        cell.alignment = Alignment(wrap_text=True, vertical='center')
        
        # Set row height to accommodate wrapped text
        ws.row_dimensions[row_idx].height = 30

    # Set header row height
    ws.row_dimensions[1].height = 25

    wb.save(file_path)
    print(f"📝 Excel report saved to: {file_path}")