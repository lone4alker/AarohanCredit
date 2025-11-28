# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Set Up Environment

```bash
# Copy environment template
cp env.example .env

# Set your Gemini API key (required for LangChain agents)
echo "GEMINI_API_KEY=<your-key>" >> .env
```

> Get a key from [Google AI Studio](https://makersuite.google.com/). Credit scoring, policy matching, and explainability agents require it.

### Step 3: Run Example

```bash
# Run the end-to-end example
python -m agents_platform.examples.run_end_to_end
```

**Expected Output**:
```
================================================================================
MSME Credit Intelligence Platform - End-to-End Example
================================================================================

Step 1: Loading sample data...
   ✓ Loaded 20 transactions

Step 2: Initializing orchestrator...
   ✓ Orchestrator initialized

Step 3: Running complete analysis pipeline...
   - Financial Health Agent
   - Credit Scoring Agent
   - Policy Matching Agent
   - Explainability Agent

   ✓ Analysis completed successfully!

Step 4: Building unified credit report...
   ✓ Report ID: <uuid>
   ✓ MSME ID: MSME_001

================================================================================
CREDIT INTELLIGENCE REPORT SUMMARY
================================================================================

Overall Creditworthiness: 75.5/100
Risk Level: MEDIUM
Behavioral Score: 650/1000
...
```

### Step 4: Start API Server

```bash
# Start the FastAPI server
python -m agents_platform.api.main

# Or with uvicorn
uvicorn agents_platform.api.main:app --reload
```

Visit `http://localhost:8000/docs` for interactive API documentation.

### Step 5: Test API

```bash
# Health check
curl http://localhost:8000/health

# Analyze credit (using sample data)
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d @agents_platform/examples/sample_data.json

# Or hit any agent individually
curl -X POST "http://localhost:8000/api/v1/agent/credit-scoring" \
  -H "Content-Type: application/json" \
  -d '{"transactions": [...], "financial_health": {...}}'
```

---

## 📝 Using in Your Code

### Basic Usage

```python
from agents_platform.agents.credit_scoring_agent import CreditScoringAgent

agent = CreditScoringAgent()
result = agent.run({
    "transactions": [...],
    "financial_health": {...}
})

if result.success:
    print("Behavioral score:", result.data["behavioral_score"])
```

### Using Individual Agents

```python
from agents_platform.agents.financial_health_agent import FinancialHealthAgent

agent = FinancialHealthAgent()
result = agent.run({'transactions': [...]})

if result.success:
    health_summary = result.data
    print(f"Net Cashflow: {health_summary['net_cashflow']}")
```

---

## 🎯 Next Steps

1. **Customize Policies**: Edit `data/lender_policies.json` to add your lender products
2. **Add Your Data**: Replace sample data with your actual transaction data
3. **Extend Agents**: Add custom logic to agents as needed
4. **Integrate**: Connect to your existing systems via API

---

## ❓ Troubleshooting

### Import Errors

```bash
# Make sure you're in the project root
cd agents_platform
python -m agents_platform.examples.run_end_to_end
```

### Missing Dependencies

```bash
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Change port in .env or use different port
uvicorn agents_platform.api.main:app --port 8001
```

---

**Ready to go!** 🎉

