"""
Tools for categorizing transactions and detecting patterns.
"""

from typing import List, Dict, Any
from datetime import datetime
import re
import logging

from ..core.types import TransactionType, CashflowCategory

logger = logging.getLogger(__name__)


def categorize_transaction(transaction: Dict[str, Any]) -> tuple[TransactionType, CashflowCategory]:
    """
    Categorize a single transaction.
    
    Args:
        transaction: Transaction dictionary
        
    Returns:
        Tuple of (TransactionType, CashflowCategory)
    """
    description = str(transaction.get('description', '')).lower()
    amount = float(transaction.get('amount', 0))
    
    # Determine transaction type
    tx_type = TransactionType.UNKNOWN
    
    # Check for EMI patterns
    if any(keyword in description for keyword in ['emi', 'loan', 'repayment', 'installment']):
        tx_type = TransactionType.EMI
    
    # Check for GST patterns
    elif any(keyword in description for keyword in ['gst', 'tax', 'tds', 'cgst', 'sgst', 'igst']):
        if amount < 0:
            tx_type = TransactionType.GST_PAYMENT
        else:
            tx_type = TransactionType.GST_RECEIPT
    
    # Check for credit/debit
    elif amount > 0:
        tx_type = TransactionType.CREDIT
    elif amount < 0:
        tx_type = TransactionType.DEBIT
    
    # Determine category
    category = CashflowCategory.OTHER
    
    if tx_type == TransactionType.EMI:
        category = CashflowCategory.FINANCING
    elif tx_type in [TransactionType.GST_PAYMENT, TransactionType.GST_RECEIPT]:
        category = CashflowCategory.TAX
    elif any(keyword in description for keyword in ['salary', 'wage', 'payment', 'invoice', 'bill']):
        category = CashflowCategory.OPERATIONAL
    elif any(keyword in description for keyword in ['investment', 'deposit', 'fd', 'mutual fund']):
        category = CashflowCategory.INVESTMENT
    elif tx_type in [TransactionType.CREDIT, TransactionType.DEBIT]:
        category = CashflowCategory.OPERATIONAL
    
    return tx_type, category


def categorize_all_transactions(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Categorize all transactions in a list.
    
    Args:
        transactions: List of transaction dictionaries
        
    Returns:
        List of transactions with added 'type' and 'category' fields
    """
    categorized = []
    for tx in transactions:
        tx_type, category = categorize_transaction(tx)
        tx_copy = tx.copy()
        tx_copy['type'] = tx_type.value
        tx_copy['category'] = category.value
        categorized.append(tx_copy)
    
    return categorized


def detect_cashflow_patterns(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Detect cashflow patterns in transactions.
    
    Args:
        transactions: List of categorized transactions
        
    Returns:
        Dictionary with pattern analysis
    """
    if not transactions:
        return {
            'has_seasonality': False,
            'volatility': 0.0,
            'regular_credits': False,
            'regular_debits': False
        }
    
    # Extract amounts by month
    monthly_amounts = {}
    for tx in transactions:
        date = parse_date(tx.get('date'))
        month_key = f"{date.year}-{date.month:02d}"
        if month_key not in monthly_amounts:
            monthly_amounts[month_key] = {'credits': 0, 'debits': 0, 'count': 0}
        
        amount = float(tx.get('amount', 0))
        if amount > 0:
            monthly_amounts[month_key]['credits'] += amount
        else:
            monthly_amounts[month_key]['debits'] += abs(amount)
        monthly_amounts[month_key]['count'] += 1
    
    # Calculate volatility (coefficient of variation)
    credit_amounts = [m['credits'] for m in monthly_amounts.values()]
    if credit_amounts:
        mean_credits = sum(credit_amounts) / len(credit_amounts)
        variance = sum((x - mean_credits) ** 2 for x in credit_amounts) / len(credit_amounts)
        std_dev = variance ** 0.5
        volatility = (std_dev / mean_credits) if mean_credits > 0 else 0.0
    else:
        volatility = 0.0
    
    # Detect seasonality (simplified - check for consistent patterns)
    has_seasonality = len(monthly_amounts) >= 3 and volatility < 0.5
    
    # Check for regular patterns
    regular_credits = len([m for m in monthly_amounts.values() if m['credits'] > 0]) >= len(monthly_amounts) * 0.7
    regular_debits = len([m for m in monthly_amounts.values() if m['debits'] > 0]) >= len(monthly_amounts) * 0.7
    
    return {
        'has_seasonality': has_seasonality,
        'volatility': min(volatility, 1.0),  # Cap at 1.0
        'regular_credits': regular_credits,
        'regular_debits': regular_debits,
        'monthly_breakdown': monthly_amounts
    }


def parse_date(date_value: Any) -> datetime:
    """Parse date value to datetime."""
    if isinstance(date_value, datetime):
        return date_value
    
    if isinstance(date_value, str):
        from ..tools.data_parser import parse_date as pd
        return pd(date_value)
    
    return datetime.now()

