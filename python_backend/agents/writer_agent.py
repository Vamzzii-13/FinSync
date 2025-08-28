from openpyxl import Workbook

def writer_agent(data: list, file_path: str):
    wb = Workbook()
    
    # Remove default sheet and create GST-compliant sheets
    wb.remove(wb.active)
    
    # Create B2B Invoices Sheet (main sheet for business transactions)
    b2b_ws = wb.create_sheet("B2B Invoices")
    
    # GST B2B Invoice headers as per official requirements
    b2b_headers = [
        "S.No.",
        "Recipient GSTIN", 
        "Supplier Name",
        "Supplier Address", 
        "Supplier GSTIN",
        "Invoice Number",
        "Invoice Date",
        "Invoice Value",
        "Place of Supply",
        "Reverse Charge",
        "Invoice Type",
        "HSN Code",
        "Item Description",
        "Quantity",
        "Unit Code (UQC)",
        "Unit Rate",
        "Taxable Value",
        "Tax Rate (%)",
        "CGST Amount",
        "SGST Amount", 
        "IGST Amount",
        "UTGST Amount",
        "Cess Amount",
        "Discount/Abatement"
    ]
    
    # Set optimal column widths for GST compliance
    column_widths = {
        'A': 6,   # S.No.
        'B': 18,  # Recipient GSTIN
        'C': 25,  # Supplier Name
        'D': 30,  # Supplier Address
        'E': 18,  # Supplier GSTIN
        'F': 20,  # Invoice Number
        'G': 12,  # Invoice Date
        'H': 15,  # Invoice Value
        'I': 20,  # Place of Supply
        'J': 12,  # Reverse Charge
        'K': 12,  # Invoice Type
        'L': 10,  # HSN Code
        'M': 25,  # Item Description
        'N': 10,  # Quantity
        'O': 8,   # Unit Code
        'P': 12,  # Unit Rate
        'Q': 15,  # Taxable Value
        'R': 10,  # Tax Rate
        'S': 12,  # CGST Amount
        'T': 12,  # SGST Amount
        'U': 12,  # IGST Amount
        'V': 12,  # UTGST Amount
        'W': 12,  # Cess Amount
        'X': 15   # Discount/Abatement
    }
    
    # Apply column widths to B2B sheet
    for col_letter, width in column_widths.items():
        b2b_ws.column_dimensions[col_letter].width = width
    
    # Create headers for B2B sheet
    for col, header in enumerate(b2b_headers, start=1):
        cell = b2b_ws.cell(row=1, column=col)
        cell.value = header
    
    # Process data for B2B sheet
    for row_idx, record in enumerate(data, start=2):
        # Clean supplier name
        supplier_name = record.get("Shop Name", "")
        if isinstance(supplier_name, str):
            supplier_name = supplier_name.replace('\n', ', ').strip()
        
        # Extract HSN codes for individual rows
        hsn_codes = record.get("HSN Code", [])
        if isinstance(hsn_codes, list) and hsn_codes:
            primary_hsn = hsn_codes[0] if hsn_codes else ""
        else:
            primary_hsn = hsn_codes if hsn_codes else ""
        
        # Map data to GST B2B format
        b2b_data = {
            1: row_idx - 1,  # S.No.
            2: "",  # Recipient GSTIN (empty for purchase invoices)
            3: supplier_name,  # Supplier Name
            4: "",  # Supplier Address (not extracted)
            5: record.get("GSTIN", ""),  # Supplier GSTIN
            6: record.get("Invoice Number", ""),  # Invoice Number
            7: record.get("Invoice Date", ""),  # Invoice Date
            8: record.get("Total Amount", ""),  # Invoice Value
            9: "",  # Place of Supply (not extracted)
            10: "No",  # Reverse Charge (default No)
            11: "Regular",  # Invoice Type (default Regular)
            12: primary_hsn,  # HSN Code
            13: "",  # Item Description (not extracted)
            14: "",  # Quantity (not extracted)
            15: "",  # Unit Code (not extracted)
            16: "",  # Unit Rate (not extracted)
            17: record.get("Total Amount", ""),  # Taxable Value (using total for now)
            18: "",  # Tax Rate (not extracted)
            19: record.get("CGST", ""),  # CGST Amount
            20: record.get("SGST", ""),  # SGST Amount
            21: record.get("IGST", ""),  # IGST Amount
            22: "",  # UTGST Amount (not applicable usually)
            23: "",  # Cess Amount (not extracted)
            24: ""   # Discount/Abatement (not extracted)
        }
        
        # Fill B2B data cells
        for col_idx, value in b2b_data.items():
            cell = b2b_ws.cell(row=row_idx, column=col_idx)
            if value in (None, "", "null", 0, 0.0):
                value = ""
            cell.value = value
    
    # Create HSN Summary Sheet
    hsn_ws = wb.create_sheet("HSN Summary")
    
    hsn_headers = [
        "S.No.",
        "HSN Code", 
        "Description",
        "UQC",
        "Total Quantity",
        "Total Value",
        "Taxable Value",
        "Tax Rate (%)",
        "CGST Amount",
        "SGST Amount",
        "IGST Amount"
    ]
    
    # Set column widths for HSN sheet
    hsn_column_widths = {
        'A': 6,   # S.No.
        'B': 12,  # HSN Code
        'C': 30,  # Description
        'D': 8,   # UQC
        'E': 12,  # Total Quantity
        'F': 15,  # Total Value
        'G': 15,  # Taxable Value
        'H': 10,  # Tax Rate
        'I': 12,  # CGST Amount
        'J': 12,  # SGST Amount
        'K': 12   # IGST Amount
    }
    
    for col_letter, width in hsn_column_widths.items():
        hsn_ws.column_dimensions[col_letter].width = width
    
    # Create HSN headers
    for col, header in enumerate(hsn_headers, start=1):
        cell = hsn_ws.cell(row=1, column=col)
        cell.value = header
    
    # Process HSN summary data
    hsn_summary = {}
    for record in data:
        hsn_codes = record.get("HSN Code", [])
        if isinstance(hsn_codes, list):
            for hsn in hsn_codes:
                if hsn and hsn not in hsn_summary:
                    hsn_summary[hsn] = {
                        'total_value': 0,
                        'cgst': 0,
                        'sgst': 0,
                        'igst': 0
                    }
                if hsn:
                    try:
                        hsn_summary[hsn]['total_value'] += float(str(record.get("Total Amount", 0)).replace("", "0"))
                        hsn_summary[hsn]['cgst'] += float(str(record.get("CGST", 0)).replace("", "0"))
                        hsn_summary[hsn]['sgst'] += float(str(record.get("SGST", 0)).replace("", "0"))
                        hsn_summary[hsn]['igst'] += float(str(record.get("IGST", 0)).replace("", "0"))
                    except (ValueError, TypeError):
                        pass
    
    # Fill HSN summary data
    hsn_row = 2
    for idx, (hsn_code, hsn_data) in enumerate(hsn_summary.items(), 1):
        hsn_ws.cell(row=hsn_row, column=1).value = idx  # S.No.
        hsn_ws.cell(row=hsn_row, column=2).value = hsn_code  # HSN Code
        hsn_ws.cell(row=hsn_row, column=3).value = ""  # Description (not extracted)
        hsn_ws.cell(row=hsn_row, column=4).value = ""  # UQC
        hsn_ws.cell(row=hsn_row, column=5).value = ""  # Total Quantity
        hsn_ws.cell(row=hsn_row, column=6).value = hsn_data['total_value']  # Total Value
        hsn_ws.cell(row=hsn_row, column=7).value = hsn_data['total_value']  # Taxable Value
        hsn_ws.cell(row=hsn_row, column=8).value = ""  # Tax Rate
        hsn_ws.cell(row=hsn_row, column=9).value = hsn_data['cgst']  # CGST Amount
        hsn_ws.cell(row=hsn_row, column=10).value = hsn_data['sgst']  # SGST Amount
        hsn_ws.cell(row=hsn_row, column=11).value = hsn_data['igst']  # IGST Amount
        hsn_row += 1
    
    # Create Document Issued List Sheet
    doc_ws = wb.create_sheet("Document Issued")
    
    doc_headers = [
        "S.No.",
        "Document Type",
        "Document Number From",
        "Document Number To", 
        "Total Number",
        "Cancelled"
    ]
    
    # Set column widths for Document sheet
    for col_letter in ['A', 'B', 'C', 'D', 'E', 'F']:
        doc_ws.column_dimensions[col_letter].width = 15
    
    # Create Document headers
    for col, header in enumerate(doc_headers, start=1):
        cell = doc_ws.cell(row=1, column=col)
        cell.value = header
    
    wb.save(file_path)
    print(f"📝 GST-compliant Excel report with multiple sheets saved to: {file_path}")