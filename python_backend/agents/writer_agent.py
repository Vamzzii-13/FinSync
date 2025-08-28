from openpyxl import Workbook

def writer_agent(data: list, file_path: str):
    wb = Workbook()
    ws = wb.active
    ws.title = "GST Report"

    # Simple headers
    headers = [
        "S.No.", "Vendor/Shop Name", "GSTIN", "Invoice No.", "Date", 
        "Taxable Amount", "Total Tax", "CGST", "SGST", "IGST", "HSN Codes"
    ]

    # Set optimal column widths
    column_widths = {
        'A': 8,   # S.No.
        'B': 25,  # Vendor/Shop Name (wider for long names)
        'C': 18,  # GSTIN
        'D': 20,  # Invoice No.
        'E': 12,  # Date
        'F': 15,  # Taxable Amount
        'G': 12,  # Total Tax
        'H': 12,  # CGST
        'I': 12,  # SGST
        'J': 12,  # IGST
        'K': 35   # HSN Codes (wider for multiple codes)
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
        ws.cell(row=row_idx, column=1).value = row_idx - 1
        
        # Clean shop name - remove line breaks for better display
        shop_name = record.get("Shop Name", "N/A")
        if isinstance(shop_name, str):
            shop_name = shop_name.replace('\n', ', ').strip()
        
        # Map data to columns
        row_data = {
            2: shop_name,  # Vendor/Shop Name
            3: record.get("GSTIN", "N/A"),
            4: record.get("Invoice Number", "N/A"),
            5: record.get("Invoice Date", "N/A"),
            6: record.get("Total Amount", "N/A"),
            7: record.get("Tax Amount", "N/A"),
            8: record.get("CGST", "N/A"),
            9: record.get("SGST", "N/A"),
            10: record.get("IGST", "N/A")
        }
        
        # Fill data cells
        for col_idx, value in row_data.items():
            cell = ws.cell(row=row_idx, column=col_idx)
            # Clean and format values
            if value in (None, "", "null", 0, 0.0):
                value = "N/A"
            cell.value = value
        
        # Handle HSN Codes
        hsn_codes = record.get("HSN Code", "N/A")
        cell = ws.cell(row=row_idx, column=11)
        
        if isinstance(hsn_codes, list):
            # Format as comma-separated for better readability
            formatted_hsn = ", ".join(str(code) for code in hsn_codes if code)
            cell.value = formatted_hsn
        elif isinstance(hsn_codes, str) and "," in hsn_codes:
            formatted_hsn = ", ".join(code.strip() for code in hsn_codes.split(",") if code.strip())
            cell.value = formatted_hsn
        else:
            cell.value = hsn_codes if hsn_codes else "N/A"

    wb.save(file_path)
    print(f"📝 Excel report saved to: {file_path}")