"""
Tools for detecting anomalies and red flags in financial data.
"""

from typing import List, Dict, Any
from datetime import datetime
import statistics
import logging

logger = logging.getLogger(__name__)


def detect_anomalies(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Detect anomalies in transaction data.
    
    Args:
        transactions: List of transactions
        
    Returns:
        List of anomaly dictionaries with type, description, and severity
    """
    anomalies = []
    
    if not transactions or len(transactions) < 3:
        return anomalies
    
    amounts = [abs(float(tx.get('amount', 0))) for tx in transactions]
    if not amounts:
        return anomalies
    
    mean_amount = statistics.mean(amounts)
    std_dev = statistics.stdev(amounts) if len(amounts) > 1 else 0
    
    # Detect outliers (beyond 3 standard deviations)
    threshold = mean_amount + (3 * std_dev) if std_dev > 0 else mean_amount * 2
    
    for tx in transactions:
        amount = abs(float(tx.get('amount', 0)))
        if amount > threshold and threshold > 0:
            anomalies.append({
                'type': 'outlier_transaction',
                'description': f"Unusually large transaction: {amount:,.2f}",
                'severity': 'high' if amount > threshold * 2 else 'medium',
                'transaction': tx,
                'date': tx.get('date')
            })
    
    # Detect rapid balance changes
    balances = [(parse_date(tx.get('date')), float(tx.get('balance_after', 0))) 
                for tx in transactions if tx.get('balance_after') is not None]
    balances.sort(key=lambda x: x[0])
    
    if len(balances) > 1:
        for i in range(1, len(balances)):
            prev_balance = balances[i-1][1]
            curr_balance = balances[i][1]
            change_pct = abs((curr_balance - prev_balance) / prev_balance) if prev_balance != 0 else 0
            
            if change_pct > 0.5:  # More than 50% change
                anomalies.append({
                    'type': 'rapid_balance_change',
                    'description': f"Rapid balance change: {change_pct*100:.1f}%",
                    'severity': 'medium',
                    'date': balances[i][0],
                    'previous_balance': prev_balance,
                    'current_balance': curr_balance
                })
    
    return anomalies


def detect_red_flags(transactions: List[Dict[str, Any]], financial_health: Dict[str, Any]) -> List[str]:
    """
    Detect lending red flags.
    
    Args:
        transactions: List of transactions
        financial_health: Financial health summary dictionary
        
    Returns:
        List of red flag descriptions
    """
    red_flags = []
    
    # Negative cashflow
    if financial_health.get('net_cashflow', 0) < 0:
        red_flags.append("Sustained negative cashflow")
    
    # High volatility
    if financial_health.get('volatility_score', 0) > 0.7:
        red_flags.append("Extremely high cashflow volatility")
    
    # Multiple stress indicators
    stress_count = len(financial_health.get('stress_indicators', []))
    if stress_count >= 3:
        red_flags.append(f"Multiple financial stress indicators ({stress_count})")
    
    # Low stability
    if financial_health.get('cashflow_stability_score', 0) < 0.3:
        red_flags.append("Very low cashflow stability")
    
    # Check for suspicious patterns
    emi_count = sum(1 for tx in transactions if 'emi' in str(tx.get('description', '')).lower())
    if emi_count > len(transactions) * 0.3:
        red_flags.append("High proportion of EMI payments (potential over-leverage)")
    
    # Check for bounced transactions (simplified - would need actual bounce data)
    negative_balances = [tx for tx in transactions if tx.get('balance_after') and float(tx.get('balance_after', 0)) < 0]
    if len(negative_balances) > 5:
        red_flags.append("Multiple instances of negative balances")
    
    return red_flags


def parse_date(date_value: Any) -> datetime:
    """Parse date value to datetime."""
    if isinstance(date_value, datetime):
        return date_value
    
    if isinstance(date_value, str):
        from ..tools.data_parser import parse_date as pd
        return pd(date_value)
    
    return datetime.now()

