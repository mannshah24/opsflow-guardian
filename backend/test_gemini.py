#!/usr/bin/env python3
"""
Test script for Gemini 2.5 Pro integration in OpsFlow Guardian
Run this to verify your setup before deployment
"""

import os
import asyncio
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.services.gemini_service import GeminiService
from app.core.config import settings

async def test_gemini_integration():
    """Test Gemini 2.5 Pro integration"""
    print("🚀 Testing OpsFlow Guardian with Gemini 2.5 Pro...")
    print("=" * 50)
    
    # Check environment variables
    print("1. Checking environment setup...")
    if not settings.GOOGLE_API_KEY:
        print("❌ ERROR: GOOGLE_API_KEY not found in environment")
        print("Please set your Gemini API key in .env file:")
        print("GOOGLE_API_KEY=your_google_gemini_api_key_here")
        return False
    
    print(f"✅ GOOGLE_API_KEY found: {settings.GOOGLE_API_KEY[:10]}...")
    print(f"✅ Using model: {settings.GEMINI_MODEL}")
    
    # Test Gemini service
    print("\n2. Testing Gemini service connection...")
    try:
        gemini_service = GeminiService()
        await gemini_service.initialize()
        print("✅ Gemini service initialized successfully")
        
        # Test connection
        connection_test = await gemini_service.test_connection()
        if connection_test["status"] == "success":
            print("✅ Gemini API connection successful")
            print(f"   Response: {connection_test['response']}")
        else:
            print(f"❌ Gemini API connection failed: {connection_test['error']}")
            return False
            
    except Exception as e:
        print(f"❌ Gemini service initialization failed: {e}")
        return False
    
    # Test workflow planning
    print("\n3. Testing workflow plan generation...")
    try:
        from app.models.workflow import WorkflowRequest
        
        test_request = WorkflowRequest(
            id="test-001",
            description="Create a new employee onboarding workflow with email notifications and document creation",
            user_id="test_user",
            priority="medium",
            context="New hire needs access to systems and welcome materials"
        )
        
        plan_data = await gemini_service.generate_workflow_plan(test_request)
        print("✅ Workflow plan generated successfully")
        print(f"   Plan summary: {plan_data.get('plan_summary', 'N/A')}")
        print(f"   Steps count: {len(plan_data.get('steps', []))}")
        print(f"   Risk level: {plan_data.get('overall_risk', 'N/A')}")
        
    except Exception as e:
        print(f"❌ Workflow planning test failed: {e}")
        return False
    
    # Test agent chat
    print("\n4. Testing agent chat functionality...")
    try:
        response = await gemini_service.chat_with_agent(
            "Hello! I need help creating a workflow for customer onboarding.",
            "planner",
            {"test": True}
        )
        print("✅ Agent chat working successfully")
        print(f"   Response preview: {response[:100]}...")
        
    except Exception as e:
        print(f"❌ Agent chat test failed: {e}")
        return False
    
    # Model information
    print("\n5. Getting model information...")
    model_info = gemini_service.get_model_info()
    print("✅ Model information retrieved")
    print(f"   Provider: {model_info['provider']}")
    print(f"   Model: {model_info['model']}")
    print(f"   Version: {model_info['version']}")
    print(f"   Context window: {model_info['context_window']}")
    print(f"   Cost per 1K tokens: ${model_info['cost_per_1k_tokens']}")
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed! Your Gemini 2.5 Pro integration is ready!")
    print("🚀 You can now run your OpsFlow Guardian with Gemini AI.")
    print("\nNext steps:")
    print("1. Start your backend: cd backend && source venv/bin/activate && python main.py")
    print("2. Start your frontend: npm run dev")
    print("3. Visit http://localhost:5173 to see your AI-powered workflow system!")
    
    return True

async def main():
    """Main test function"""
    try:
        # Load environment variables
        from dotenv import load_dotenv
        load_dotenv()
        
        success = await test_gemini_integration()
        
        if not success:
            print("\n❌ Some tests failed. Please check the errors above.")
            sys.exit(1)
        else:
            print("\n✅ All systems operational! 🚀")
            
    except KeyboardInterrupt:
        print("\n\n⏹️ Test interrupted by user.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
