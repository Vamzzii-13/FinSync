from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

def writer_agent(data: list, file_path: str):
    wb = Workbook()
    ws = wb.active
    ws.title = "GST Audit Report"

    # Professional styling
    header_font = Font(name='Arial', size=11, bold=True, color='FFFFFF')
    data_font = Font(name='Arial', size=10)
    header_fill = PatternFill(start_color='2B5D84', end_color='2B5D84', fill_type='solid')
    border = Border(
        left=Side(style='thin'),
        right=Side(style='thin'),
        top=Side(style='thin'),
        bottom=Side(style='thin')
    )

    # Enhanced headers for better auditing
    headers = [
        "S.No.", "Vendor/Shop Name", "GSTIN", "Invoice No.", "Date", 
        "Taxable Amount", "Total Tax", "CGST", "SGST", "IGST", "HSN Codes"
    ]

    # Set optimal column widths for auditor readability
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

    # Create headers with professional styling
    for col, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col)
        cell.value = header
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        cell.border = border

    # Set header row height
    ws.row_dimensions[1].height = 30

    # Process data rows
    for row_idx, record in enumerate(data, start=2):
        # Serial number
        ws.cell(row=row_idx, column=1).value = row_idx - 1
        ws.cell(row=row_idx, column=1).alignment = Alignment(horizontal='center')
        
        # Clean shop name - remove line breaks for better display
        shop_name = record.get("Shop Name", "N/A")
        if isinstance(shop_name, str):
            shop_name = shop_name.replace('\n', ', ').strip()
        
        # Map data to columns with proper formatting
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
            cell.font = data_font
            cell.border = border
            cell.alignment = Alignment(vertical='center', wrap_text=True if col_idx == 2 else False)
        
        # Handle HSN Codes specially
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
            
        cell.font = data_font
        cell.border = border
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        
        # Set row height for better visibility
        ws.row_dimensions[row_idx].height = 25

    # Add totals row if there's data
    if data:
        total_row = len(data) + 2
        
        # Total label
        cell = ws.cell(row=total_row, column=1)
        cell.value = "TOTAL"
        cell.font = Font(name='Arial', size=10, bold=True)
        cell.alignment = Alignment(horizontal='center')
        cell.border = border
        
        # Merge cells for total label
        ws.merge_cells(f'A{total_row}:E{total_row}')
        
        # Calculate totals for numeric columns
        try:
            total_amount = sum(float(str(record.get("Total Amount", 0)).replace("N/A", "0")) for record in data)
            total_tax = sum(float(str(record.get("Tax Amount", 0)).replace("N/A", "0")) for record in data)
            total_cgst = sum(float(str(record.get("CGST", 0)).replace("N/A", "0")) for record in data)
            total_sgst = sum(float(str(record.get("SGST", 0)).replace("N/A", "0")) for record in data)
            total_igst = sum(float(str(record.get("IGST", 0)).replace("N/A", "0")) for record in data)
            
            # Add totals
            ws.cell(row=total_row, column=6).value = f"₹{total_amount:,.2f}"
            ws.cell(row=total_row, column=7).value = f"₹{total_tax:,.2f}"
            ws.cell(row=total_row, column=8).value = f"₹{total_cgst:,.2f}"
            ws.cell(row=total_row, column=9).value = f"₹{total_sgst:,.2f}"
            ws.cell(row=total_row, column=10).value = f"₹{total_igst:,.2f}"
            
            # Style total cells
            for col in range(6, 11):
                cell = ws.cell(row=total_row, column=col)
                cell.font = Font(name='Arial', size=10, bold=True)
                cell.border = border
                cell.alignment = Alignment(horizontal='right')
                
        except (ValueError, TypeError):
            # If calculation fails, just add N/A
            for col in range(6, 11):
                ws.cell(row=total_row, column=col).value = "N/A"

    # Add audit information
    info_row = len(data) + 4
    ws.cell(row=info_row, column=1).value = "Generated for GST Audit Purposes"
    ws.cell(row=info_row, column=1).font = Font(name='Arial', size=9, italic=True)
    
    ws.cell(row=info_row + 1, column=1).value = f"Total Invoices: {len(data)}"
    ws.cell(row=info_row + 1, column=1).font = Font(name='Arial', size=9)

    # Freeze header row for easier navigation
    ws.freeze_panes = 'A2'

    wb.save(file_path)
    print(f"📝 Professional audit-ready Excel report saved to: {file_path}")