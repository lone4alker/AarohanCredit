"""
Tools for financial calculations and metrics.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import statistics
import logging

logger = logging.getLogger(__name__)


def compute_cashflow_metrics(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Compute cashflow metrics from transactions.
    
    Args:
        transactions: List of transaction dictionaries
        
    Returns:
        Dictionary with cashflow metrics
    """
    if not transactions:
        return {
            'total_inflow': 0.0,
            'total_outflow': 0.0,
            'net_cashflow': 0.0,
            'average_inflow': 0.0,
            'average_outflow': 0.0
        }
    
    inflows = [float(tx.get('amount', 0)) for tx in transactions if float(tx.get('amount', 0)) > 0]
    outflows = [abs(float(tx.get('amount', 0))) for tx in transactions if float(tx.get('amount', 0)) < 0]
    
    total_inflow = sum(inflows)
    total_outflow = sum(outflows)
    net_cashflow = total_inflow - total_outflow
    
    return {
        'total_inflow': total_inflow,
        'total_outflow': total_outflow,
        'net_cashflow': net_cashflow,
        'average_inflow': statistics.mean(inflows) if inflows else 0.0,
        'average_outflow': statistics.mean(outflows) if outflows else 0.0,
        'inflow_count': len(inflows),
        'outflow_count': len(outflows)
    }


def compute_balance_metrics(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Compute balance-related metrics.
    
    Args:
        transactions: List of transactions with balance_after field
        
    Returns:
        Dictionary with balance metrics
    """
    balances = [float(tx.get('balance_after', 0)) for tx in transactions if tx.get('balance_after') is not None]
    
    if not balances:
        return {
            'average_balance': 0.0,
            'min_balance': 0.0,
            'max_balance': 0.0,
            'balance_volatility': 0.0
        }
    
    return {
        'average_balance': statistics.mean(balances),
        'min_balance': min(balances),
        'max_balance': max(balances),
        'balance_volatility': statistics.stdev(balances) if len(balances) > 1 else 0.0,
        'median_balance': statistics.median(balances)
    }


def compute_stability_score(transactions: List[Dict[str, Any]], period_days: Optional[int] = None) -> float:
    """
    Compute cashflow stability score (0-1, higher is more stable).
    
    Args:
        transactions: List of transactions
        period_days: Number of days in the period (auto-calculated if None)
        
    Returns:
        Stability score between 0 and 1
    """
    if not transactions or len(transactions) < 2:
        return 0.0
    
    # Calculate period if not provided
    if period_days is None:
        dates = [parse_date(tx.get('date')) for tx in transactions]
        if dates:
            period_days = (max(dates) - min(dates)).days + 1
    
    if period_days <= 0:
        return 0.0
    
    # Get monthly inflows
    monthly_inflows = {}
    for tx in transactions:
        amount = float(tx.get('amount', 0))
        if amount > 0:
            date = parse_date(tx.get('date'))
            month_key = f"{date.year}-{date.month:02d}"
            monthly_inflows[month_key] = monthly_inflows.get(month_key, 0) + amount
    
    if not monthly_inflows:
        return 0.0
    
    # Calculate coefficient of variation (lower is more stable)
    inflow_values = list(monthly_inflows.values())
    if len(inflow_values) < 2:
        return 0.5
    
    mean_inflow = statistics.mean(inflow_values)
    if mean_inflow == 0:
        return 0.0
    
    std_dev = statistics.stdev(inflow_values)
    cv = std_dev / mean_inflow
    
    # Convert to stability score (inverse, normalized to 0-1)
    stability = 1.0 / (1.0 + cv)
    
    return min(max(stability, 0.0), 1.0)


def detect_stress_indicators(transactions: List[Dict[str, Any]]) -> List[str]:
    """
    Detect financial stress indicators.
    
    Args:
        transactions: List of transactions
        
    Returns:
        List of stress indicator descriptions
    """
    indicators = []
    
    if not transactions:
        return ["No transaction data available"]
    
    # Get balance metrics
    balance_metrics = compute_balance_metrics(transactions)
    cashflow_metrics = compute_cashflow_metrics(transactions)
    
    # Low balance indicator
    if balance_metrics['min_balance'] < 0:
        indicators.append("Negative balance detected")
    elif balance_metrics['min_balance'] < 1000:
        indicators.append("Very low minimum balance")
    
    # Negative cashflow
    if cashflow_metrics['net_cashflow'] < 0:
        indicators.append("Negative net cashflow")
    
    # High volatility
    if balance_metrics['balance_volatility'] > balance_metrics['average_balance'] * 0.5:
        indicators.append("High balance volatility")
    
    # Check for overdraft patterns
    negative_balances = [tx for tx in transactions if tx.get('balance_after') and float(tx.get('balance_after', 0)) < 0]
    if len(negative_balances) > len(transactions) * 0.1:
        indicators.append("Frequent negative balances")
    
    # Check for large outflows relative to inflows
    if cashflow_metrics['total_inflow'] > 0:
        outflow_ratio = cashflow_metrics['total_outflow'] / cashflow_metrics['total_inflow']
        if outflow_ratio > 0.9:
            indicators.append("Outflows exceed 90% of inflows")
    
    return indicators


def parse_date(date_value: Any) -> datetime:
    """Parse date value to datetime."""
    if isinstance(date_value, datetime):
        return date_value
    
    if isinstance(date_value, str):
        from ..tools.data_parser import parse_date as pd
        return pd(date_value)
    
    return datetime.now()

