#!/usr/bin/env python3
"""
Simple Portia configuration test
"""
import os
from portia import Config, LLMProvider

def test_basic_portia():
    print("🧪 Basic Portia SDK Test")
    
    # Set up basic environment (you can set your actual key here)
    os.environ['GOOGLE_API_KEY'] = 'your-google-api-key-here'
    
    try:
        # Create config
        config = Config.from_default()
        
        # Configure for Google
        config.llm_provider = LLMProvider.GOOGLE
        config.google_api_key = os.environ.get('GOOGLE_API_KEY', '')
        
        # Update models to use Google format
        config.models.default_model = 'google/gemini-1.5-flash'
        config.models.planning_model = 'google/gemini-1.5-flash'
        config.models.execution_model = 'google/gemini-1.5-flash'
        
        print("✅ Portia Config created successfully")
        print(f"📊 LLM Provider: {config.llm_provider}")
        print(f"📊 Default Model: {config.models.default_model}")
        print(f"📊 Planning Model: {config.models.planning_model}")
        print(f"📊 API Key Set: {'Yes' if config.google_api_key else 'No'}")
        
        return config
        
    except Exception as e:
        print(f"❌ Config test failed: {e}")
        return None

if __name__ == "__main__":
    config = test_basic_portia()
    
    if config:
        print("\n🎉 Basic Portia configuration successful!")
        print("Next step: Set your actual GOOGLE_API_KEY and run full tests")
    else:
        print("\n❌ Basic configuration failed")
