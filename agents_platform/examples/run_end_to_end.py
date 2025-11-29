"""
End-to-end example of running the complete credit intelligence analysis.
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents_platform.orchestrator.orchestrator import OrchestratorAgent
from agents_platform.report_builder.report_builder import ReportBuilder
from agents_platform.core.types import UnifiedCreditReport
from agents_platform.core.db import get_database


def load_sample_data():
    """Load sample transaction data from MongoDB."""
    print("Connecting to MongoDB to fetch sample data...")
    try:
        db = get_database()
        collection = db["msme_data"]
        # Fetch the first document or a specific one
        # For this example, we'll just fetch one document
        data = collection.find_one()
        
        if not data:
            print("No data found in 'msme_data' collection. Please run seed_db.py first.")
            sys.exit(1)
            
        # Remove _id as it's not JSON serializable by default and might not be needed for analysis
        if '_id' in data:
            del data['_id']
            
        return data
    except Exception as e:
        print(f"Error loading data from MongoDB: {e}")
        sys.exit(1)


def save_results_to_db(report: UnifiedCreditReport, summary: dict):
    """Save the report and summary to MongoDB."""
    print("Saving results to MongoDB...")
    try:
        db = get_database()
        
        # Save full report
        reports_collection = db["credit_reports"]
        report_data = json.loads(ReportBuilder.to_json(report))
        report_data["created_at"] = datetime.utcnow()
        reports_collection.insert_one(report_data)
        print(f"   ✓ Full report saved to 'credit_reports' collection")
        
        # Save summary
        summaries_collection = db["credit_summaries"]
        summary_data = summary.copy()
        summary_data["msme_id"] = report.msme_id
        summary_data["report_id"] = report.report_id
        summary_data["created_at"] = datetime.utcnow()
        summaries_collection.insert_one(summary_data)
        print(f"   ✓ Summary saved to 'credit_summaries' collection")
        
    except Exception as e:
        print(f"Error saving results to MongoDB: {e}")


def main():
    """Run end-to-end analysis."""
    print("=" * 80)
    print("MSME Credit Intelligence Platform - End-to-End Example")
    print("=" * 80)
    print()
    
    # Load sample data
    print("Step 1: Loading sample data...")
    data = load_sample_data()
    
    # Count transactions from new format (bank_accounts) or old format
    transaction_count = len(data.get('transactions', []))
    if transaction_count == 0 and 'bank_accounts' in data:
        transaction_count = sum(len(acc.get('transactions', [])) for acc in data.get('bank_accounts', []))
    
    print(f"   ✓ Loaded data with {transaction_count} transactions")
    print()
    
    # Prepare input - pass entire data structure (agents will extract what they need)
    input_data = data.copy()  # This preserves bank_accounts, gst_filings, msme_profile structure
    
    # Extract msme_id and business_name for context
    msme_profile = data.get('msme_profile', {})
    context = {
        'msme_id': msme_profile.get('msme_id', data.get('msme_id', 'MSME_001')),
        'business_name': msme_profile.get('business_name', data.get('business_name', 'Unknown'))
    }
    
    # Initialize orchestrator
    print("Step 2: Initializing orchestrator...")
    orchestrator = OrchestratorAgent()
    print("   ✓ Orchestrator initialized")
    print()
    
    # Run analysis
    print("Step 3: Running complete analysis pipeline...")
    print("   - Financial Health Agent")
    print("   - Credit Scoring Agent")
    print("   - Policy Matching Agent")
    print("   - Explainability Agent")
    print()
    
    result = orchestrator.run(input_data, context)
    
    if not result.success:
        print("❌ Analysis failed!")
        print(f"Errors: {', '.join(result.errors)}")
        return
    
    print("   ✓ Analysis completed successfully!")
    print()
    
    # Build report
    print("Step 4: Building unified credit report...")
    report = UnifiedCreditReport(**result.data)
    print(f"   ✓ Report ID: {report.report_id}")
    print(f"   ✓ MSME ID: {report.msme_id}")
    print()
    
    # Display summary
    print("=" * 80)
    print("CREDIT INTELLIGENCE REPORT SUMMARY")
    print("=" * 80)
    print()
    
    print(f"Overall Creditworthiness: {report.overall_creditworthiness:.1f}/100")
    print(f"Risk Level: {report.behavioral_score.risk_level.value.upper()}")
    print(f"Behavioral Score: {report.behavioral_score.behavioral_score:.0f}/1000")
    print()
    
    print("Financial Health:")
    print(f"  Net Cashflow: ₹{report.financial_health.net_cashflow:,.2f}")
    print(f"  Total Inflow: ₹{report.financial_health.total_inflow:,.2f}")
    print(f"  Total Outflow: ₹{report.financial_health.total_outflow:,.2f}")
    print(f"  Stability Score: {report.financial_health.cashflow_stability_score:.2f}")
    print(f"  Volatility Score: {report.financial_health.volatility_score:.2f}")
    print()
    
    print("Product Recommendations:")
    best_fit = report.product_recommendations.best_fit_products
    if best_fit:
        for i, product in enumerate(best_fit[:3], 1):
            print(f"  {i}. {product.product_name} ({product.lender_name})")
            print(f"     Eligibility: {'✓ Eligible' if product.eligible else '✗ Not Eligible'}")
            print(f"     Score: {product.eligibility_score:.1f}/100")
            if product.recommended_amount:
                print(f"     Recommended Amount: ₹{product.recommended_amount:,.2f}")
    else:
        print("  No eligible products found")
    print()
    
    print("Key Insights:")
    for insight in report.explainability.key_insights[:5]:
        print(f"  • {insight}")
    print()
    
    print("Strengths:")
    for strength in report.explainability.strengths[:3]:
        print(f"  ✓ {strength}")
    print()
    
    if report.explainability.weaknesses:
        print("Areas for Improvement:")
        for weakness in report.explainability.weaknesses[:3]:
            print(f"  ⚠ {weakness}")
        print()
    
    # Save full report and summary to MongoDB
    print("Step 5: Saving results...")
    
    # Generate summary dict
    summary = ReportBuilder.to_summary(report)
    
    # Save to MongoDB
    save_results_to_db(report, summary)
    
    # Also save to files for reference (optional, but good for debugging)
    output_file = Path(__file__).parent / "output_report.json"
    with open(output_file, 'w') as f:
        f.write(ReportBuilder.to_json(report))
    print(f"   ✓ Full report also saved to file: {output_file}")
    
    summary_file = Path(__file__).parent / "output_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    print(f"   ✓ Summary also saved to file: {summary_file}")
    print()
    
    print("=" * 80)
    print("Analysis Complete!")
    print("=" * 80)


if __name__ == "__main__":
    main()

