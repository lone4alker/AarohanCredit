"""
Tools for parsing various data formats (CSV, PDF, JSON).
"""

import json
import csv
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def parse_json_data(file_path: str) -> Dict[str, Any]:
    """
    Parse JSON data file.
    
    Args:
        file_path: Path to JSON file
        
    Returns:
        Parsed JSON data as dictionary
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info(f"Successfully parsed JSON file: {file_path}")
        return data
    except Exception as e:
        logger.error(f"Error parsing JSON file {file_path}: {str(e)}")
        raise


def parse_csv_data(file_path: str) -> List[Dict[str, Any]]:
    """
    Parse CSV data file.
    
    Args:
        file_path: Path to CSV file
        
    Returns:
        List of dictionaries representing rows
    """
    try:
        rows = []
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)
        logger.info(f"Successfully parsed CSV file: {file_path} with {len(rows)} rows")
        return rows
    except Exception as e:
        logger.error(f"Error parsing CSV file {file_path}: {str(e)}")
        raise


def extract_transactions_from_json(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Extract transaction data from JSON structure.
    
    Args:
        data: JSON data dictionary
        
    Returns:
        List of transaction dictionaries
    """
    transactions = []
    
    # Handle various JSON structures
    if 'transactions' in data:
        transactions = data['transactions']
    elif 'bank_statements' in data:
        for statement in data['bank_statements']:
            if 'transactions' in statement:
                transactions.extend(statement['transactions'])
    elif isinstance(data, list):
        transactions = data
    else:
        # Try to find any list of dictionaries that might be transactions
        for key, value in data.items():
            if isinstance(value, list) and len(value) > 0:
                if isinstance(value[0], dict) and any(k in value[0] for k in ['date', 'amount', 'description']):
                    transactions = value
                    break
    
    # Normalize transaction format
    normalized = []
    for tx in transactions:
        normalized_tx = {
            'date': parse_date(tx.get('date', tx.get('transaction_date', ''))),
            'amount': float(tx.get('amount', tx.get('transaction_amount', 0))),
            'description': str(tx.get('description', tx.get('narration', tx.get('remarks', '')))),
            'balance_after': float(tx.get('balance_after', tx.get('balance', 0))) if tx.get('balance_after') or tx.get('balance') else None,
            'type': tx.get('type', 'unknown'),
            'category': tx.get('category')
        }
        normalized.append(normalized_tx)
    
    return normalized


def parse_date(date_str: Any) -> datetime:
    """
    Parse date string to datetime object.
    
    Args:
        date_str: Date string in various formats
        
    Returns:
        Datetime object
    """
    if isinstance(date_str, datetime):
        return date_str
    
    if not date_str:
        return datetime.now()
    
    # Try common date formats
    formats = [
        '%Y-%m-%d',
        '%Y-%m-%d %H:%M:%S',
        '%d-%m-%Y',
        '%d/%m/%Y',
        '%Y/%m/%d',
        '%d-%b-%Y',
        '%d %b %Y'
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(str(date_str), fmt)
        except ValueError:
            continue
    
    # If all fail, return current date
    logger.warning(f"Could not parse date: {date_str}, using current date")
    return datetime.now()


def extract_gst_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract GST-related data from JSON.
    
    Args:
        data: JSON data dictionary
        
    Returns:
        Dictionary with GST data
    """
    gst_data = {
        'gst_payments': [],
        'gst_receipts': [],
        'total_gst_paid': 0.0,
        'total_gst_collected': 0.0
    }
    
    if 'gst_statements' in data:
        for statement in data['gst_statements']:
            if 'payments' in statement:
                gst_data['gst_payments'].extend(statement['payments'])
            if 'receipts' in statement:
                gst_data['gst_receipts'].extend(statement['receipts'])
    
    # Calculate totals
    gst_data['total_gst_paid'] = sum(p.get('amount', 0) for p in gst_data['gst_payments'])
    gst_data['total_gst_collected'] = sum(r.get('amount', 0) for r in gst_data['gst_receipts'])
    
    return gst_data

