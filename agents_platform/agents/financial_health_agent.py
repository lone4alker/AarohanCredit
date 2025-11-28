"""
Financial Health Agent - Analyzes financial data and produces health metrics.
"""

from typing import Dict, Any, Optional
from datetime import datetime

from ..core.base_agent import BaseAgent
from ..core.types import AgentOutput, FinancialHealthSummary
from ..tools.data_parser import extract_transactions_from_json, parse_date
from ..tools.transaction_categorizer import categorize_all_transactions, detect_cashflow_patterns
from ..tools.financial_calculator import (
    compute_cashflow_metrics,
    compute_balance_metrics,
    compute_stability_score,
    detect_stress_indicators
)


class FinancialHealthAgent(BaseAgent):
    """
    Agent responsible for:
    - Extracting and cleaning raw financial data
    - Categorizing transactions
    - Detecting cashflow patterns
    - Computing financial health metrics
    """
    
    def __init__(self):
        super().__init__(
            name="FinancialHealthAgent",
            description="Analyzes financial data and produces health metrics"
        )
    
    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Process financial data and generate health summary.
        
        Args:
            input_data: Dictionary containing financial data (JSON structure or file path)
            context: Optional context (e.g., file paths, configuration)
            
        Returns:
            AgentOutput with FinancialHealthSummary
        """
        try:
            self.log_step("Starting financial health analysis")
            
            # Step 1: Extract transactions
            self.log_step("Step 1: Extracting transactions from input data")
            transactions = self._extract_transactions(input_data, context)
            
            if not transactions:
                return self.create_output(
                    success=False,
                    data={},
                    errors=["No transactions found in input data"]
                )
            
            self.log_step(f"Extracted {len(transactions)} transactions")
            
            # Step 2: Categorize transactions
            self.log_step("Step 2: Categorizing transactions")
            categorized_transactions = categorize_all_transactions(transactions)
            
            # Count by category
            category_counts = {}
            for tx in categorized_transactions:
                cat = tx.get('category', 'unknown')
                category_counts[cat] = category_counts.get(cat, 0) + 1
            
            self.log_step(f"Transactions categorized: {category_counts}")
            
            # Step 3: Detect cashflow patterns
            self.log_step("Step 3: Detecting cashflow patterns")
            patterns = detect_cashflow_patterns(categorized_transactions)
            
            # Step 4: Compute metrics
            self.log_step("Step 4: Computing financial metrics")
            cashflow_metrics = compute_cashflow_metrics(categorized_transactions)
            balance_metrics = compute_balance_metrics(categorized_transactions)
            stability_score = compute_stability_score(categorized_transactions)
            stress_indicators = detect_stress_indicators(categorized_transactions)
            
            # Step 5: Determine period
            dates = [parse_date(tx.get('date')) for tx in categorized_transactions]
            period_start = min(dates) if dates else datetime.now()
            period_end = max(dates) if dates else datetime.now()
            
            # Step 6: Build summary
            self.log_step("Step 5: Building financial health summary")
            summary = FinancialHealthSummary(
                total_inflow=cashflow_metrics['total_inflow'],
                total_outflow=cashflow_metrics['total_outflow'],
                net_cashflow=cashflow_metrics['net_cashflow'],
                average_balance=balance_metrics['average_balance'],
                min_balance=balance_metrics['min_balance'],
                max_balance=balance_metrics['max_balance'],
                volatility_score=patterns['volatility'],
                seasonality_detected=patterns['has_seasonality'],
                stress_indicators=stress_indicators,
                cashflow_stability_score=stability_score,
                transaction_count=len(categorized_transactions),
                period_start=period_start,
                period_end=period_end,
                categorized_transactions=category_counts,
                metadata={
                    'pattern_analysis': patterns,
                    'balance_volatility': balance_metrics.get('balance_volatility', 0),
                    'inflow_count': cashflow_metrics.get('inflow_count', 0),
                    'outflow_count': cashflow_metrics.get('outflow_count', 0)
                }
            )
            
            self.log_step("Financial health analysis completed successfully")
            
            return self.create_output(
                success=True,
                data=summary.model_dump(),
                metadata={
                    'agent': self.name,
                    'timestamp': datetime.now().isoformat(),
                    'transactions_processed': len(categorized_transactions)
                }
            )
            
        except Exception as e:
            self.logger.error(f"Error in financial health analysis: {str(e)}", exc_info=True)
            return self.create_output(
                success=False,
                data={},
                errors=[f"Financial health analysis failed: {str(e)}"]
            )
    
    def _extract_transactions(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]]) -> list:
        """
        Extract transactions from input data.
        
        Args:
            input_data: Input data dictionary
            context: Optional context
            
        Returns:
            List of transaction dictionaries
        """
        # If input_data is already a list of transactions
        if isinstance(input_data, list):
            return input_data
        
        # If input_data has a file_path key
        if 'file_path' in input_data:
            from ..tools.data_parser import parse_json_data
            data = parse_json_data(input_data['file_path'])
            return extract_transactions_from_json(data)
        
        # If input_data is a dictionary with transaction data
        if 'transactions' in input_data:
            return input_data['transactions']
        
        # Try to extract from JSON structure
        return extract_transactions_from_json(input_data)

