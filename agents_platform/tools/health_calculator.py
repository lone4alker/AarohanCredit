"""
Tools for health analysis calculations.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import statistics
import logging
from collections import defaultdict

from .data_parser import parse_date
from .data_parser import extract_gst_data

logger = logging.getLogger(__name__)


def compute_monthly_cashflow(transactions: List[Dict[str, Any]]) -> Dict[str, Dict[str, float]]:
    """
    Compute monthly inflow and outflow.
    
    Args:
        transactions: List of transaction dictionaries
        
    Returns:
        Dictionary with 'inflow' and 'outflow' keys, each containing month->amount mapping
    """
    monthly_inflow = defaultdict(float)
    monthly_outflow = defaultdict(float)
    
    for tx in transactions:
        date = parse_date(tx.get('date'))
        month_key = f"{date.year}-{date.month:02d}"
        amount = float(tx.get('amount', 0))
        
        if amount > 0:
            monthly_inflow[month_key] += amount
        else:
            monthly_outflow[month_key] += abs(amount)
    
    return {
        'inflow': dict(monthly_inflow),
        'outflow': dict(monthly_outflow)
    }


def compute_cashflow_volatility(monthly_inflow: Dict[str, float], monthly_outflow: Dict[str, float]) -> float:
    """
    Compute cashflow volatility (0-1, higher is more volatile).
    
    Args:
        monthly_inflow: Month -> inflow amount
        monthly_outflow: Month -> outflow amount
        
    Returns:
        Volatility score between 0 and 1
    """
    # Calculate net cashflow per month
    all_months = set(list(monthly_inflow.keys()) + list(monthly_outflow.keys()))
    monthly_net = {}
    
    for month in all_months:
        inflow = monthly_inflow.get(month, 0)
        outflow = monthly_outflow.get(month, 0)
        monthly_net[month] = inflow - outflow
    
    if len(monthly_net) < 2:
        return 0.5
    
    net_values = list(monthly_net.values())
    mean_net = statistics.mean(net_values)
    
    if mean_net == 0:
        return 1.0
    
    std_dev = statistics.stdev(net_values) if len(net_values) > 1 else 0
    cv = abs(std_dev / mean_net) if mean_net != 0 else 1.0
    
    # Normalize to 0-1 (higher CV = higher volatility)
    volatility = min(1.0, cv / 2.0)  # Cap at 1.0 when CV >= 2.0
    
    return volatility


def compute_avg_monthly_balance(transactions: List[Dict[str, Any]]) -> float:
    """
    Compute average monthly balance.
    
    Args:
        transactions: List of transactions with balance_after field
        
    Returns:
        Average monthly balance
    """
    # Group balances by month
    monthly_balances = defaultdict(list)
    
    for tx in transactions:
        if tx.get('balance_after') is not None:
            date = parse_date(tx.get('date'))
            month_key = f"{date.year}-{date.month:02d}"
            balance = float(tx.get('balance_after', 0))
            monthly_balances[month_key].append(balance)
    
    if not monthly_balances:
        return 0.0
    
    # Calculate average balance per month, then average across months
    monthly_avg_balances = []
    for month, balances in monthly_balances.items():
        if balances:
            monthly_avg_balances.append(statistics.mean(balances))
    
    if not monthly_avg_balances:
        return 0.0
    
    return statistics.mean(monthly_avg_balances)


def count_low_balance_days(transactions: List[Dict[str, Any]], threshold: float = 50000) -> int:
    """
    Count days with balance below threshold.
    
    Args:
        transactions: List of transactions with balance_after field
        threshold: Balance threshold (default 50000)
        
    Returns:
        Number of days with balance below threshold
    """
    low_balance_days = set()
    
    for tx in transactions:
        if tx.get('balance_after') is not None:
            balance = float(tx.get('balance_after', 0))
            if balance < threshold:
                date = parse_date(tx.get('date'))
                day_key = date.date().isoformat()
                low_balance_days.add(day_key)
    
    return len(low_balance_days)


def count_emi_transactions(transactions: List[Dict[str, Any]]) -> int:
    """
    Count EMI transactions.
    
    Args:
        transactions: List of transactions
        
    Returns:
        Number of EMI transactions
    """
    emi_count = 0
    
    for tx in transactions:
        desc = str(tx.get('description', '')).lower()
        tx_type = str(tx.get('type', '')).lower()
        
        # Check for EMI indicators
        if 'emi' in desc or 'loan' in desc or tx_type == 'emi':
            emi_count += 1
    
    return emi_count


def count_cheque_bounces(transactions: List[Dict[str, Any]]) -> int:
    """
    Count cheque bounce transactions.
    
    Args:
        transactions: List of transactions
        
    Returns:
        Number of cheque bounces
    """
    bounce_count = 0
    
    for tx in transactions:
        desc = str(tx.get('description', '')).lower()
        
        # Check for bounce indicators
        if any(keyword in desc for keyword in ['bounce', 'returned', 'dishonour', 'insufficient']):
            bounce_count += 1
    
    return bounce_count


def count_overdraft_days(transactions: List[Dict[str, Any]]) -> int:
    """
    Count days with negative balance (overdraft).
    
    Args:
        transactions: List of transactions with balance_after field
        
    Returns:
        Number of days with negative balance
    """
    overdraft_days = set()
    
    for tx in transactions:
        if tx.get('balance_after') is not None:
            balance = float(tx.get('balance_after', 0))
            if balance < 0:
                date = parse_date(tx.get('date'))
                day_key = date.date().isoformat()
                overdraft_days.add(day_key)
    
    return len(overdraft_days)


def analyze_gst_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze GST filing data.
    
    Args:
        data: Input data dictionary containing gst_filings
        
    Returns:
        Dictionary with GST analysis metrics
    """
    gst_data = extract_gst_data(data)
    
    gst_filings = gst_data.get('gst_filings', [])
    
    if not gst_filings:
        return {
            'total_filings': 0,
            'filed_count': 0,
            'pending_count': 0,
            'nil_returns': 0,
            'avg_monthly_sales': 0.0,
            'avg_monthly_purchases': 0.0,
            'avg_monthly_tax_paid': 0.0,
            'compliance_rate': 0.0,
            'total_sales': 0.0,
            'total_purchases': 0.0,
            'total_net_tax_paid': 0.0
        }
    
    filed_count = sum(1 for f in gst_filings if f.get('status', '').lower() == 'filed')
    nil_returns = sum(1 for f in gst_filings if f.get('nil_return', False))
    
    total_sales = gst_data.get('total_sales', 0.0)
    total_purchases = gst_data.get('total_purchases', 0.0)
    total_net_tax_paid = gst_data.get('total_net_tax_paid', 0.0)
    
    avg_monthly_sales = total_sales / len(gst_filings) if gst_filings else 0.0
    avg_monthly_purchases = total_purchases / len(gst_filings) if gst_filings else 0.0
    avg_monthly_tax_paid = total_net_tax_paid / len(gst_filings) if gst_filings else 0.0
    
    compliance_rate = (filed_count / len(gst_filings)) * 100 if gst_filings else 0.0
    
    return {
        'total_filings': len(gst_filings),
        'filed_count': filed_count,
        'pending_count': len(gst_filings) - filed_count,
        'nil_returns': nil_returns,
        'avg_monthly_sales': avg_monthly_sales,
        'avg_monthly_purchases': avg_monthly_purchases,
        'avg_monthly_tax_paid': avg_monthly_tax_paid,
        'compliance_rate': compliance_rate,
        'total_sales': total_sales,
        'total_purchases': total_purchases,
        'total_net_tax_paid': total_net_tax_paid,
        'b2b_sales_ratio': sum(f.get('b2b_sales', 0) for f in gst_filings) / total_sales if total_sales > 0 else 0.0
    }
