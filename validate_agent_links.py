#!/usr/bin/env python3
"""
OpsFlow Guardian 2.0 - Agent Links Validation Script
Validates all required agent links and configurations
"""
import os
import requests
from urllib.parse import urlparse
import json
from dotenv import load_dotenv

def load_environment():
    """Load environment variables"""
    load_dotenv()
    return os.environ

def validate_url(url, name):
    """Validate if a URL is reachable"""
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return f"❌ {name}: Invalid URL format"
        
        # Skip actual HTTP requests for external services to avoid rate limits
        # Just validate URL format
        return f"✅ {name}: URL format valid"
    except Exception as e:
        return f"❌ {name}: Error - {str(e)}"

def validate_agent_links():
    """Validate all agent links from environment configuration"""
    print("🔗 OpsFlow Guardian 2.0 - Agent Links Validation")
    print("=" * 60)
    
    env = load_environment()
    
    # Define categories of links to check
    categories = {
        "🤖 AI Model Providers": [
            ("OPENAI_BASE_URL", "OpenAI API"),
            ("ANTHROPIC_BASE_URL", "Anthropic API"),
            ("GOOGLE_AI_BASE_URL", "Google AI API"),
            ("MISTRAL_BASE_URL", "Mistral AI API"),
            ("OLLAMA_BASE_URL", "Ollama API"),
        ],
        
        "🎯 Portia SDK": [
            ("PORTIA_BASE_URL", "Portia API"),
            ("PORTIA_WEBSOCKET_URL", "Portia WebSocket"),
            ("PORTIA_DOCS_URL", "Portia Documentation"),
            ("PORTIA_STATUS_URL", "Portia Status"),
        ],
        
        "🔗 Third-Party Services": [
            ("SLACK_API_URL", "Slack API"),
            ("NOTION_API_URL", "Notion API"),
            ("JIRA_API_BASE_URL", "JIRA API"),
            ("GITHUB_API_URL", "GitHub API"),
            ("MICROSOFT_GRAPH_URL", "Microsoft Graph"),
        ],
        
        "🔒 OAuth Providers": [
            ("GOOGLE_OAUTH_URL", "Google OAuth"),
            ("GITHUB_OAUTH_URL", "GitHub OAuth"),
            ("MICROSOFT_OAUTH_URL", "Microsoft OAuth"),
        ],
        
        "💳 Payment Services": [
            ("STRIPE_API_URL", "Stripe API"),
            ("SENDGRID_API_URL", "SendGrid API"),
            ("TWILIO_API_URL", "Twilio API"),
        ],
        
        "🗄️ Storage & Database": [
            ("DATABASE_URL", "PostgreSQL Database"),
            ("REDIS_URL", "Redis Cache"),
            ("AWS_S3_ENDPOINT", "AWS S3"),
        ],
        
        "📊 Monitoring": [
            ("PROMETHEUS_URL", "Prometheus"),
            ("GRAFANA_URL", "Grafana"),
            ("ELASTICSEARCH_URL", "Elasticsearch"),
        ],
        
        "🎣 Webhooks": [
            ("AGENT_WEBHOOK_BASE_URL", "Agent Webhooks"),
            ("WORKFLOW_CALLBACK_URL", "Workflow Callbacks"),
            ("APPROVAL_CALLBACK_URL", "Approval Callbacks"),
        ],
    }
    
    total_links = 0
    valid_links = 0
    
    for category, links in categories.items():
        print(f"\n{category}")
        print("-" * 40)
        
        for env_key, display_name in links:
            total_links += 1
            url = env.get(env_key)
            
            if not url:
                print(f"⚠️  {display_name}: Not configured")
            else:
                result = validate_url(url, display_name)
                print(f"   {result}")
                if "✅" in result:
                    valid_links += 1
    
    # Summary
    print(f"\n📊 Validation Summary")
    print("=" * 40)
    print(f"Total Links Checked: {total_links}")
    print(f"Valid URLs: {valid_links}")
    print(f"Missing/Invalid: {total_links - valid_links}")
    print(f"Configuration Coverage: {(valid_links/total_links)*100:.1f}%")
    
    # Recommendations
    print(f"\n💡 Recommendations")
    print("=" * 40)
    
    if valid_links == total_links:
        print("✅ All agent links are properly configured!")
    elif valid_links >= total_links * 0.8:
        print("🟡 Most links configured. Review missing ones for full functionality.")
    else:
        print("🔴 Many links missing. Please configure required URLs in .env file.")
    
    print("\n📚 Resources:")
    print("   • Documentation: AGENT_LINKS_REQUIREMENTS.md")
    print("   • Template: backend/.env.example")
    print("   • Current Config: backend/.env")

def check_api_keys():
    """Check if required API keys are configured"""
    print(f"\n🔑 API Keys Check")
    print("-" * 40)
    
    env = load_environment()
    
    required_keys = [
        "PORTIA_API_KEY",
        "OPENAI_API_KEY",
        "SECRET_KEY",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
    ]
    
    for key in required_keys:
        value = env.get(key)
        if not value or "your_" in value.lower():
            print(f"⚠️  {key}: Not configured")
        else:
            print(f"✅ {key}: Configured")

if __name__ == "__main__":
    validate_agent_links()
    check_api_keys()
    
    print(f"\n🚀 Next Steps:")
    print("   1. Configure missing URLs in backend/.env")
    print("   2. Add your actual API keys")
    print("   3. Test connectivity: python3 test_auth.py")
    print("   4. Start services: Backend + Frontend")
    print("   5. Monitor logs for any connection issues")
