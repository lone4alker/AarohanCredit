"""
End-to-end example of running the complete credit intelligence analysis.
"""

import json
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents_platform.orchestrator.orchestrator import OrchestratorAgent
from agents_platform.report_builder.report_builder import ReportBuilder
from agents_platform.core.types import UnifiedCreditReport


def load_sample_data():
    """Load sample transaction data."""
    sample_file = Path(__file__).parent / "sample_data.json"
    with open(sample_file, 'r') as f:
        return json.load(f)


def main():
    """Run end-to-end analysis."""
    print("=" * 80)
    print("MSME Credit Intelligence Platform - End-to-End Example")
    print("=" * 80)
    print()
    
    # Load sample data
    print("Step 1: Loading sample data...")
    data = load_sample_data()
    print(f"   ✓ Loaded {len(data.get('transactions', []))} transactions")
    print()
    
    # Prepare input
    input_data = {
        'transactions': data.get('transactions', [])
    }
    
    context = {
        'msme_id': data.get('msme_id', 'MSME_001'),
        'business_name': data.get('business_name', 'Unknown')
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
    
    # Save full report
    print("Step 5: Saving full report...")
    output_file = Path(__file__).parent / "output_report.json"
    with open(output_file, 'w') as f:
        f.write(ReportBuilder.to_json(report))
    print(f"   ✓ Full report saved to: {output_file}")
    print()
    
    # Save summary
    summary_file = Path(__file__).parent / "output_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(ReportBuilder.to_summary(report), f, indent=2, default=str)
    print(f"   ✓ Summary saved to: {summary_file}")
    print()
    
    print("=" * 80)
    print("Analysis Complete!")
    print("=" * 80)


if __name__ == "__main__":
    main()

