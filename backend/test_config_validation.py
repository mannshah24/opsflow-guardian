#!/usr/bin/env python3
"""
OpsFlow Guardian 2.0 - Configuration Validation Test
Quick test to validate all integrations are properly configured
"""

import sys
import os
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "app"))

from app.core.config import settings

class ConfigurationValidator:
    """Validates all required configurations for integrations"""
    
    def __init__(self):
        self.required_configs = {}
        self.optional_configs = {}
        self.validation_results = {}
    
    def run_validation(self):
        """Run complete configuration validation"""
        self.print_header()
        self.define_requirements()
        self.validate_all_configs()
        self.print_results()
        return self.get_readiness_status()
    
    def print_header(self):
        """Print validation header"""
        print("="*80)
        print("🔧 OPSFLOW GUARDIAN 2.0 - CONFIGURATION VALIDATION")
        print("🔗 Checking All Required API Keys & Integration Settings")
        print("="*80)
    
    def define_requirements(self):
        """Define required and optional configurations"""
        self.required_configs = {
            "Core Application": {
                "GOOGLE_API_KEY": "Google Gemini 2.5 API access",
                "SECRET_KEY": "Application security key (min 32 chars)",
                "DATABASE_URL": "PostgreSQL database connection",
                "REDIS_URL": "Redis cache connection"
            },
            "Google Services": {
                "GOOGLE_CLIENT_ID": "Google OAuth client ID",
                "GOOGLE_CLIENT_SECRET": "Google OAuth client secret"
            },
            "Communication": {
                "SLACK_BOT_TOKEN": "Slack bot integration",
                "SENDGRID_API_KEY": "Email notifications"
            },
            "Productivity": {
                "NOTION_TOKEN": "Notion workspace integration"
            },
            "Development": {
                "JIRA_SERVER": "Jira server URL",
                "JIRA_USERNAME": "Jira username",
                "JIRA_API_TOKEN": "Jira API token"
            }
        }
        
        self.optional_configs = {
            "Payment": {
                "STRIPE_SECRET_KEY": "Stripe payment processing"
            },
            "SMS": {
                "TWILIO_ACCOUNT_SID": "Twilio SMS service",
                "TWILIO_AUTH_TOKEN": "Twilio authentication"
            },
            "Backup AI": {
                "OPENAI_API_KEY": "OpenAI GPT-4 fallback",
                "ANTHROPIC_API_KEY": "Claude API fallback"
            },
            "Portia SDK": {
                "PORTIA_API_KEY": "Enhanced Portia features"
            }
        }
    
    def validate_all_configs(self):
        """Validate all configuration categories"""
        print("\n🔍 VALIDATING REQUIRED CONFIGURATIONS:")
        print("─" * 60)
        
        total_required = 0
        configured_required = 0
        
        for category, configs in self.required_configs.items():
            print(f"\n📦 {category}:")
            category_results = {}
            
            for config_key, description in configs.items():
                total_required += 1
                
                # Get value from settings
                config_value = getattr(settings, config_key, None)
                
                # Check if configured
                is_configured = self.is_properly_configured(config_key, config_value)
                
                if is_configured:
                    print(f"  ✅ {config_key}: Configured")
                    configured_required += 1
                    category_results[config_key] = "CONFIGURED"
                else:
                    print(f"  ❌ {config_key}: Missing or invalid")
                    category_results[config_key] = "MISSING"
            
            self.validation_results[category] = category_results
        
        print(f"\n📊 Required Configuration Status: {configured_required}/{total_required} configured")
        
        print("\n🔍 VALIDATING OPTIONAL CONFIGURATIONS:")
        print("─" * 60)
        
        total_optional = 0
        configured_optional = 0
        
        for category, configs in self.optional_configs.items():
            print(f"\n📦 {category} (Optional):")
            category_results = {}
            
            for config_key, description in configs.items():
                total_optional += 1
                
                config_value = getattr(settings, config_key, None)
                is_configured = self.is_properly_configured(config_key, config_value)
                
                if is_configured:
                    print(f"  ✅ {config_key}: Configured")
                    configured_optional += 1
                    category_results[config_key] = "CONFIGURED"
                else:
                    print(f"  ⚠️ {config_key}: Not configured (optional)")
                    category_results[config_key] = "NOT_SET"
            
            self.validation_results[f"{category} (Optional)"] = category_results
        
        print(f"\n📊 Optional Configuration Status: {configured_optional}/{total_optional} configured")
    
    def is_properly_configured(self, key, value):
        """Check if a configuration value is properly set"""
        if not value:
            return False
        
        # Check for placeholder values
        placeholder_values = [
            "your_key_here",
            "your_api_key_here", 
            "change_this",
            "your_secret_key_here",
            "your_google_oauth_client_id",
            "your_slack_bot_token",
            "sk_test_your_stripe_secret_key"
        ]
        
        if any(placeholder in str(value).lower() for placeholder in placeholder_values):
            return False
        
        # Special validations
        if key == "SECRET_KEY" and len(str(value)) < 32:
            return False
        
        if key == "GOOGLE_API_KEY" and not str(value).startswith("AIza"):
            return False
        
        if key == "SLACK_BOT_TOKEN" and not str(value).startswith("xoxb-"):
            return False
        
        if key == "STRIPE_SECRET_KEY" and not str(value).startswith("sk_"):
            return False
        
        return True
    
    def print_results(self):
        """Print detailed validation results"""
        print("\n" + "="*80)
        print("📊 CONFIGURATION VALIDATION RESULTS")
        print("="*80)
        
        # Count totals
        total_required = sum(len(configs) for configs in self.required_configs.values())
        configured_required = 0
        
        total_optional = sum(len(configs) for configs in self.optional_configs.values())
        configured_optional = 0
        
        print(f"\n📋 SUMMARY BY CATEGORY:")
        for category, results in self.validation_results.items():
            configured_count = sum(1 for status in results.values() if status == "CONFIGURED")
            total_count = len(results)
            
            if "(Optional)" not in category:
                configured_required += configured_count
            else:
                configured_optional += configured_count
            
            percentage = (configured_count / total_count) * 100 if total_count > 0 else 0
            
            if percentage == 100:
                status_icon = "✅"
            elif percentage >= 80:
                status_icon = "⚠️"
            else:
                status_icon = "❌"
            
            print(f"  {status_icon} {category}: {configured_count}/{total_count} ({percentage:.0f}%)")
        
        # Overall statistics
        required_percentage = (configured_required / total_required) * 100 if total_required > 0 else 0
        optional_percentage = (configured_optional / total_optional) * 100 if total_optional > 0 else 0
        
        print(f"\n🎯 OVERALL STATISTICS:")
        print(f"  📊 Required Configs: {configured_required}/{total_required} ({required_percentage:.0f}%)")
        print(f"  📊 Optional Configs: {configured_optional}/{total_optional} ({optional_percentage:.0f}%)")
        
        # Integration readiness assessment
        if required_percentage >= 90:
            readiness_level = "🏆 EXCELLENT"
            readiness_desc = "All critical integrations ready"
        elif required_percentage >= 80:
            readiness_level = "✅ GOOD"
            readiness_desc = "Most integrations ready, minor gaps"
        elif required_percentage >= 70:
            readiness_level = "⚠️ FAIR"
            readiness_desc = "Some critical integrations missing"
        else:
            readiness_level = "❌ POOR"
            readiness_desc = "Major integrations not configured"
        
        print(f"\n🚀 INTEGRATION READINESS: {readiness_level}")
        print(f"   {readiness_desc}")
        
        # Specific recommendations
        self.print_recommendations(required_percentage, configured_required, total_required)
    
    def print_recommendations(self, required_percentage, configured_required, total_required):
        """Print specific recommendations based on validation results"""
        print(f"\n💡 RECOMMENDATIONS:")
        
        if required_percentage == 100:
            print(f"  🎉 All required configurations are set!")
            print(f"  ✅ System ready for integration testing")
            print(f"  🚀 Run: python test_integration_complete.py")
            
        elif required_percentage >= 80:
            print(f"  🔧 Configure remaining {total_required - configured_required} required settings")
            print(f"  ✅ Most critical integrations are ready")
            print(f"  ⚡ System can operate with current configuration")
            
        else:
            print(f"  ⚠️ {total_required - configured_required} critical configurations missing")
            print(f"  🔧 Priority: Configure Google API key and core services")
            print(f"  📋 Review .env.example for all required settings")
        
        # Show missing critical configs
        missing_critical = []
        for category, results in self.validation_results.items():
            if "(Optional)" not in category:
                for config_key, status in results.items():
                    if status == "MISSING":
                        missing_critical.append(config_key)
        
        if missing_critical:
            print(f"\n🔴 MISSING CRITICAL CONFIGURATIONS:")
            for config in missing_critical[:5]:  # Show top 5
                print(f"  ❌ {config}")
        
        print(f"\n📖 SETUP INSTRUCTIONS:")
        print(f"  1. Copy .env.example to .env")
        print(f"  2. Replace placeholder values with real API keys")
        print(f"  3. Run this validation script again")
        print(f"  4. Once validation passes, run integration tests")
    
    def get_readiness_status(self):
        """Get overall readiness status"""
        total_required = sum(len(configs) for configs in self.required_configs.values())
        configured_required = 0
        
        for category, results in self.validation_results.items():
            if "(Optional)" not in category:
                configured_required += sum(1 for status in results.values() if status == "CONFIGURED")
        
        return (configured_required / total_required) * 100 if total_required > 0 else 0

def main():
    """Run configuration validation"""
    validator = ConfigurationValidator()
    readiness_percentage = validator.run_validation()
    
    print(f"\n{'='*80}")
    if readiness_percentage >= 90:
        print("🎉 CONFIGURATION VALIDATION COMPLETE - READY FOR TESTING!")
        exit(0)
    elif readiness_percentage >= 80:
        print("⚠️ CONFIGURATION MOSTLY READY - MINOR ISSUES TO ADDRESS")
        exit(1)
    else:
        print("❌ CONFIGURATION INCOMPLETE - MAJOR SETUP REQUIRED")
        exit(2)

if __name__ == "__main__":
    main()
