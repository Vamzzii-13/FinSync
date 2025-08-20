#!/usr/bin/env python3
import os
import sys
import tempfile
import json
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def process_invoice_files(file_paths):
    """Process invoice files and return GST data"""
    try:
        from graphs.gst_extraction_graph import build_gst_graph
        from agents.writer_agent import writer_agent
        
        print(f"Processing {len(file_paths)} files...")
        
        # Build the GST extraction graph
        graph = build_gst_graph()
        all_invoices = []
        
        # Process each file
        for file_path in file_paths:
            print(f"Processing: {file_path}")
            result_state = graph.invoke({
                "file_path": file_path,
                "output_path": "output/Consolidated_Invoices_Output.xlsx"
            })
            gst_data = result_state.get("gst_data", [])
            all_invoices.extend(gst_data)
        
        # Generate Excel file
        output_path = "output/Consolidated_Invoices_Output.xlsx"
        os.makedirs("output", exist_ok=True)
        
        if all_invoices:
            writer_agent(all_invoices, output_path)
            return {
                "success": True,
                "message": f"Successfully processed {len(file_paths)} files and extracted {len(all_invoices)} invoices",
                "output_file": output_path,
                "invoices_count": len(all_invoices)
            }
        else:
            return {
                "success": False,
                "message": "No GST data could be extracted from the files",
                "output_file": None,
                "invoices_count": 0
            }
            
    except Exception as e:
        return {
            "success": False,
            "message": f"Error processing files: {str(e)}",
            "output_file": None,
            "invoices_count": 0
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python simple_server.py <file1> [file2] ...")
        sys.exit(1)
    
    file_paths = sys.argv[1:]
    result = process_invoice_files(file_paths)
    print(json.dumps(result, indent=2))