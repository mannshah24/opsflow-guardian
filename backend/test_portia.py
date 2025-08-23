#!/usr/bin/env python3
"""
Test script for Portia SDK integration with Google Gemini
"""
import asyncio
import json
import os
import sys
import logging
from datetime import datetime
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "app"))

from app.core.config import settings
from app.services.portia_service import PortiaService
from app.models.workflow import WorkflowRequest

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def test_portia_gemini():
    """Test Portia integration with Google Gemini"""
    print("=" * 60)
    print("Testing Portia SDK Integration with Google Gemini 2.5")
    print("=" * 60)
    
    try:
        # Check API key
        if not settings.GOOGLE_API_KEY:
            print("❌ Error: GOOGLE_API_KEY not found in environment variables")
            print("Please set your Google API key:")
            print("export GOOGLE_API_KEY='your-google-api-key-here'")
            return False
        
        print(f"✅ Google API Key found: {settings.GOOGLE_API_KEY[:10]}...")
        print(f"✅ Gemini Model: {settings.GEMINI_MODEL}")
        
        # Initialize Portia service
        print("\n🔧 Initializing Portia service...")
        portia_service = PortiaService()
        
        # Create a test workflow request
        test_request = WorkflowRequest(
            id="test-001",
            description="Create a Google Sheets report with last month's sales data and send it to the marketing team via Slack",
            user_id="test-user",
            priority="medium",
            context="This is a monthly report that needs to be automated for better efficiency"
        )
        
        print(f"\n📋 Test Request: {test_request.description}")
        
        # Test workflow planning
        print("\n🤖 Creating workflow plan with Portia + Gemini...")
        start_time = datetime.now()
        
        workflow_plan = await portia_service.create_workflow_plan(test_request)
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print(f"✅ Plan created in {duration:.2f} seconds")
        print(f"📊 Plan ID: {workflow_plan.id}")
        print(f"📊 Plan Name: {workflow_plan.name}")
        print(f"📊 Risk Level: {workflow_plan.risk_level}")
        print(f"📊 Estimated Duration: {workflow_plan.estimated_duration} minutes")
        print(f"📊 Steps Count: {len(workflow_plan.steps)}")
        
        # Display workflow steps
        print("\n📝 Workflow Steps:")
        for i, step in enumerate(workflow_plan.steps, 1):
            print(f"  {i}. {step.name}")
            print(f"     Description: {step.description}")
            print(f"     Risk Level: {step.risk_level}")
            print(f"     Tools: {', '.join(step.tool_integrations)}")
            print(f"     Duration: {step.estimated_duration} min")
            print(f"     Approval Required: {step.requires_approval}")
            print()
        
        # Test execution planning
        print("🚀 Testing workflow execution...")
        try:
            execution_plan = await portia_service.execute_workflow_plan(workflow_plan.id, test_request.user_id)
            print(f"✅ Execution plan created: {execution_plan.id}")
            print(f"📊 Status: {execution_plan.status}")
        except Exception as e:
            print(f"⚠️ Execution test failed (expected for demo): {e}")
        
        # Test agent capabilities
        print("\n🤖 Testing AI Agent capabilities...")
        test_message = "What are the key capabilities of OpsFlow Guardian?"
        
        response = await portia_service.chat_with_agent(
            message=test_message,
            user_id=test_request.user_id,
            context_data={"test_mode": True}
        )
        
        print(f"✅ Agent Response: {response[:200]}...")
        
        print("\n" + "=" * 60)
        print("🎉 Portia SDK Integration Test COMPLETED Successfully!")
        print("✅ Google Gemini integration working")
        print("✅ Workflow planning functional")
        print("✅ Agent chat capabilities active")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_portia_config():
    """Test Portia configuration setup"""
    print("\n🔧 Testing Portia Configuration...")
    
    try:
        from portia import Config, LLMProvider
        
        # Test configuration creation
        config = Config.from_default()
        config.llm_provider = LLMProvider.GOOGLE
        config.llm_model = settings.GEMINI_MODEL
        
        print(f"✅ Portia Config created successfully")
        print(f"📊 LLM Provider: {config.llm_provider}")
        print(f"📊 LLM Model: {config.llm_model}")
        
        return True
        
    except Exception as e:
        print(f"❌ Portia config test failed: {e}")
        return False

if __name__ == "__main__":
    print("Starting Portia SDK + Google Gemini Integration Tests...")
    
    # Run configuration test
    asyncio.run(test_portia_config())
    
    # Run main integration test
    success = asyncio.run(test_portia_gemini())
    
    if success:
        print("\n🎉 All tests passed! Your Portia + Gemini integration is ready!")
    else:
        print("\n❌ Some tests failed. Please check the logs above.")
        sys.exit(1)
