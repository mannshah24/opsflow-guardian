#!/usr/bin/env python3
"""
OpsFlow Guardian 2.0 - Environment Setup Helper
Helps set up .env file from .env.example with proper validation
"""

import os
import shutil
from pathlib import Path

class EnvironmentSetupHelper:
    """Helper to set up environment configuration"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.env_example = self.project_root / ".env.example"
        self.env_file = self.project_root / ".env"
    
    def setup_environment(self):
        """Set up environment file and provide instructions"""
        self.print_header()
        self.check_files()
        self.copy_env_file()
        self.provide_setup_instructions()
    
    def print_header(self):
        """Print setup header"""
        print("="*80)
        print("🔧 OPSFLOW GUARDIAN 2.0 - ENVIRONMENT SETUP")
        print("🔑 API Key Configuration Helper")
        print("="*80)
    
    def check_files(self):
        """Check for existing files"""
        print("\n📋 Checking configuration files...")
        
        if not self.env_example.exists():
            print("❌ .env.example file not found!")
            print("   Please ensure you're running this from the project root")
            exit(1)
        else:
            print("✅ Found .env.example file")
        
        if self.env_file.exists():
            print("⚠️ .env file already exists")
            response = input("   Do you want to overwrite it? (y/N): ").lower()
            if response != 'y':
                print("   Keeping existing .env file")
                return False
        
        return True
    
    def copy_env_file(self):
        """Copy .env.example to .env"""
        if self.check_files():
            print("\n📂 Creating .env file from template...")
            shutil.copy2(self.env_example, self.env_file)
            print("✅ .env file created successfully")
        else:
            print("✅ Using existing .env file")
    
    def provide_setup_instructions(self):
        """Provide detailed setup instructions"""
        print("\n" + "="*80)
        print("📖 API KEY SETUP INSTRUCTIONS")
        print("="*80)
        
        print("\n🔑 CRITICAL API KEYS (Required for basic functionality):")
        
        critical_apis = [
            {
                "name": "Google Gemini API",
                "env_var": "GOOGLE_API_KEY",
                "instructions": [
                    "1. Go to https://makersuite.google.com/app/apikey",
                    "2. Click 'Create API Key'",
                    "3. Copy the key (starts with 'AIza...')",
                    "4. Replace the placeholder in .env file",
                    "5. Enable Generative Language API in Google Cloud Console"
                ],
                "cost": "FREE tier available - $0.00025 per 1K tokens"
            },
            {
                "name": "Database Setup",
                "env_var": "DATABASE_URL",
                "instructions": [
                    "1. Install PostgreSQL locally or use cloud service",
                    "2. Create database: createdb opsflow_guardian",
                    "3. Update DATABASE_URL with your connection string",
                    "4. Format: postgresql://user:password@localhost:5432/opsflow_guardian"
                ],
                "cost": "FREE for local PostgreSQL"
            },
            {
                "name": "Redis Cache",
                "env_var": "REDIS_URL",
                "instructions": [
                    "1. Install Redis locally: apt-get install redis-server",
                    "2. Start Redis: redis-server",
                    "3. Default URL: redis://localhost:6379 (already set)",
                    "4. For cloud Redis, update with your connection string"
                ],
                "cost": "FREE for local Redis"
            }
        ]
        
        for api in critical_apis:
            print(f"\n🔧 {api['name']}:")
            print(f"   Environment Variable: {api['env_var']}")
            print(f"   💰 Cost: {api['cost']}")
            print(f"   📋 Setup Steps:")
            for instruction in api['instructions']:
                print(f"      {instruction}")
        
        print("\n🔗 INTEGRATION API KEYS (For full functionality):")
        
        integration_apis = [
            {
                "name": "Slack Integration",
                "env_vars": ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN"],
                "url": "https://api.slack.com/apps",
                "description": "For workflow notifications and team communication"
            },
            {
                "name": "Google OAuth",
                "env_vars": ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
                "url": "https://console.cloud.google.com/apis/credentials",
                "description": "For Google Workspace integrations (Drive, Gmail, Calendar)"
            },
            {
                "name": "Notion Integration",
                "env_vars": ["NOTION_TOKEN"],
                "url": "https://www.notion.so/my-integrations",
                "description": "For workspace and documentation automation"
            },
            {
                "name": "Jira Integration",
                "env_vars": ["JIRA_SERVER", "JIRA_USERNAME", "JIRA_API_TOKEN"],
                "url": "https://id.atlassian.com/manage-profile/security/api-tokens",
                "description": "For issue tracking and project management"
            },
            {
                "name": "SendGrid Email",
                "env_vars": ["SENDGRID_API_KEY"],
                "url": "https://app.sendgrid.com/settings/api_keys",
                "description": "For email notifications and communication"
            }
        ]
        
        for api in integration_apis:
            print(f"\n📦 {api['name']}:")
            print(f"   🔑 Variables: {', '.join(api['env_vars'])}")
            print(f"   🌐 Setup URL: {api['url']}")
            print(f"   📝 Purpose: {api['description']}")
        
        print("\n💡 OPTIONAL ENHANCEMENTS:")
        
        optional_apis = [
            "STRIPE_SECRET_KEY - Payment processing",
            "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN - SMS notifications",
            "OPENAI_API_KEY - GPT-4 fallback (expensive)",
            "ANTHROPIC_API_KEY - Claude API fallback",
            "PORTIA_API_KEY - Enhanced Portia SDK features"
        ]
        
        for api in optional_apis:
            print(f"   ⭐ {api}")
        
        print("\n" + "="*80)
        print("🚀 NEXT STEPS")
        print("="*80)
        
        print("\n1. 📝 Edit .env file with your API keys:")
        print(f"   nano {self.env_file}")
        print(f"   # OR")
        print(f"   code {self.env_file}")
        
        print("\n2. ✅ Validate configuration:")
        print("   cd backend")
        print("   python test_config_validation.py")
        
        print("\n3. 🧪 Run integration tests:")
        print("   python test_integration_complete.py")
        
        print("\n4. 🎬 Run demonstration:")
        print("   python demo_standalone.py")
        
        print("\n🎯 MINIMUM VIABLE SETUP (For basic testing):")
        print("   ✅ GOOGLE_API_KEY - Essential for AI functionality")
        print("   ✅ DATABASE_URL - Set up local PostgreSQL")
        print("   ✅ REDIS_URL - Set up local Redis")
        print("   ✅ SECRET_KEY - Generate secure 32+ character string")
        
        print("\n🔐 SECURITY REMINDERS:")
        print("   ❌ Never commit .env file to git")
        print("   ❌ Never share API keys publicly")
        print("   ✅ Use environment variables in production")
        print("   ✅ Regularly rotate API keys")
        
        print(f"\n📂 Configuration file location: {self.env_file}")

def main():
    """Run environment setup helper"""
    helper = EnvironmentSetupHelper()
    helper.setup_environment()

if __name__ == "__main__":
    main()
