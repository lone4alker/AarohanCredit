"""
Health Analysis Agent - Analyzes financial health metrics including monthly cashflow, balance, EMI, bounces, overdraft, and GST data.
"""

from typing import Dict, Any, Optional
from datetime import datetime

from ..core.base_agent import BaseAgent
from ..core.types import AgentOutput, HealthAnalysisSummary
from ..tools.data_parser import extract_transactions_from_json, parse_date
from ..tools.health_calculator import (
    compute_monthly_cashflow,
    compute_cashflow_volatility,
    compute_avg_monthly_balance,
    count_low_balance_days,
    count_emi_transactions,
    count_cheque_bounces,
    count_overdraft_days,
    analyze_gst_data
)


class HealthAnalysisAgent(BaseAgent):
    """
    Agent responsible for:
    - Computing monthly inflow/outflow
    - Calculating cashflow volatility
    - Analyzing balance patterns (avg, low balance days, overdraft days)
    - Counting EMI transactions
    - Counting cheque bounces
    - Analyzing GST filing data
    """
    
    def __init__(self):
        super().__init__(
            name="HealthAnalysisAgent",
            description="Analyzes financial health metrics including cashflow, balance, EMI, bounces, overdraft, and GST data"
        )
    
    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Process financial data and generate health analysis summary.
        
        Args:
            input_data: Dictionary containing financial data (JSON structure or file path)
            context: Optional context (e.g., file paths, configuration)
            
        Returns:
            AgentOutput with HealthAnalysisSummary
        """
        try:
            self.log_step("Starting health analysis")
            
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
            
            # Step 2: Compute monthly cashflow
            self.log_step("Step 2: Computing monthly cashflow")
            monthly_cashflow = compute_monthly_cashflow(transactions)
            monthly_inflow = monthly_cashflow['inflow']
            monthly_outflow = monthly_cashflow['outflow']
            
            # Step 3: Compute net cashflow
            total_inflow = sum(monthly_inflow.values())
            total_outflow = sum(monthly_outflow.values())
            net_cashflow = total_inflow - total_outflow
            
            # Step 4: Compute cashflow volatility
            self.log_step("Step 3: Computing cashflow volatility")
            cashflow_volatility = compute_cashflow_volatility(monthly_inflow, monthly_outflow)
            
            # Step 5: Compute average monthly balance
            self.log_step("Step 4: Computing average monthly balance")
            avg_balance = compute_avg_monthly_balance(transactions)
            
            # Step 6: Count low balance days
            self.log_step("Step 5: Counting low balance days")
            low_balance_days = count_low_balance_days(transactions, threshold=50000)
            
            # Step 7: Count EMI transactions
            self.log_step("Step 6: Counting EMI transactions")
            emi_transactions = count_emi_transactions(transactions)
            
            # Step 8: Count cheque bounces
            self.log_step("Step 7: Counting cheque bounces")
            cheque_bounces = count_cheque_bounces(transactions)
            
            # Step 9: Count overdraft days
            self.log_step("Step 8: Counting overdraft days")
            overdraft_days = count_overdraft_days(transactions)
            
            # Step 10: Analyze GST data
            self.log_step("Step 9: Analyzing GST data")
            gst_analysis = analyze_gst_data(input_data)
            
            # Step 11: Determine period
            dates = [parse_date(tx.get('date')) for tx in transactions]
            period_start = min(dates) if dates else datetime.now()
            period_end = max(dates) if dates else datetime.now()
            
            # Step 12: Build summary
            self.log_step("Step 10: Building health analysis summary")
            summary = HealthAnalysisSummary(
                monthly_inflow=monthly_inflow,
                monthly_outflow=monthly_outflow,
                net_cashflow=net_cashflow,
                cashflow_volatility=cashflow_volatility,
                avg_balance=avg_balance,
                low_balance_days=low_balance_days,
                emi_transactions=emi_transactions,
                cheque_bounces=cheque_bounces,
                overdraft_days=overdraft_days,
                gst_analysis=gst_analysis,
                period_start=period_start,
                period_end=period_end,
                metadata={
                    'total_inflow': total_inflow,
                    'total_outflow': total_outflow,
                    'months_analyzed': len(set(list(monthly_inflow.keys()) + list(monthly_outflow.keys())))
                }
            )
            
            self.log_step("Health analysis completed successfully")
            
            return self.create_output(
                success=True,
                data=summary.model_dump(),
                metadata={
                    'agent': self.name,
                    'timestamp': datetime.now().isoformat(),
                    'transactions_processed': len(transactions)
                }
            )
            
        except Exception as e:
            self.logger.error(f"Error in health analysis: {str(e)}", exc_info=True)
            return self.create_output(
                success=False,
                data={},
                errors=[f"Health analysis failed: {str(e)}"]
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
