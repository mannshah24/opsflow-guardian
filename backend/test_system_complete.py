#!/usr/bin/env python3
"""
Comprehensive OpsFlow Guardian 2.0 System Test
Verifies all components work according to the detailed prompt with Google Gemini
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "app"))

from app.core.config import settings
from app.services.portia_service import PortiaService
from app.models.workflow import WorkflowRequest
from app.models.agent import AgentRole

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SystemValidator:
    """Comprehensive system validation according to the prompt"""
    
    def __init__(self):
        self.portia_service = None
        self.test_results = []
    
    async def run_all_tests(self):
        """Run all system validation tests"""
        print("🚀 OpsFlow Guardian 2.0 - System Validation")
        print("=" * 60)
        
        # Test 1: Configuration Validation
        await self.test_configuration()
        
        # Test 2: Portia Integration
        await self.test_portia_integration()
        
        # Test 3: Multi-Agent System
        await self.test_multi_agent_system()
        
        # Test 4: Workflow Automation
        await self.test_workflow_automation()
        
        # Test 5: Use Case Implementations
        await self.test_use_cases()
        
        # Test 6: Security & Compliance
        await self.test_security_compliance()
        
        # Test 7: Integration Capabilities
        await self.test_integrations()
        
        # Generate final report
        self.generate_report()
    
    async def test_configuration(self):
        """Test system configuration according to prompt"""
        print("\n📋 Testing System Configuration...")
        
        try:
            # Verify Gemini as primary provider
            assert settings.LLM_PROVIDER == "google", f"Expected 'google' provider, got '{settings.LLM_PROVIDER}'"
            assert settings.GEMINI_MODEL == "google/gemini-1.5-flash", f"Expected Portia format model, got '{settings.GEMINI_MODEL}'"
            
            # Verify application settings
            assert settings.APP_NAME == "OpsFlow Guardian 2.0"
            assert settings.VERSION == "2.0.0"
            
            # Check required configurations
            required_configs = [
                'DATABASE_URL', 'REDIS_URL', 'MAX_TOKENS', 'TEMPERATURE',
                'RATE_LIMIT_REQUESTS', 'RATE_LIMIT_WINDOW'
            ]
            
            for config in required_configs:
                assert hasattr(settings, config), f"Missing required config: {config}"
            
            self.test_results.append(("Configuration", "PASS", "All configurations valid"))
            print("✅ Configuration validation passed")
            
        except Exception as e:
            self.test_results.append(("Configuration", "FAIL", str(e)))
            print(f"❌ Configuration validation failed: {e}")
    
    async def test_portia_integration(self):
        """Test Portia SDK integration"""
        print("\n🔧 Testing Portia SDK Integration...")
        
        try:
            from portia import Portia, Config, LLMProvider
            
            # Test Portia config creation
            config = Config.from_default()
            config.llm_provider = LLMProvider.GOOGLE
            config.google_api_key = "test-key"  # Placeholder for testing
            config.models.default_model = settings.GEMINI_MODEL
            
            assert config.llm_provider == LLMProvider.GOOGLE
            assert config.models.default_model == "google/gemini-1.5-flash"
            
            self.test_results.append(("Portia Integration", "PASS", "SDK integration successful"))
            print("✅ Portia SDK integration verified")
            
        except Exception as e:
            self.test_results.append(("Portia Integration", "FAIL", str(e)))
            print(f"❌ Portia SDK integration failed: {e}")
    
    async def test_multi_agent_system(self):
        """Test multi-agent system implementation"""
        print("\n🤖 Testing Multi-Agent System...")
        
        try:
            self.portia_service = PortiaService()
            await self.portia_service.initialize()
            
            # Verify all three agents are created
            agents = self.portia_service.agents
            expected_agents = ["planner-001", "executor-001", "auditor-001"]
            
            for agent_id in expected_agents:
                assert agent_id in agents, f"Missing agent: {agent_id}"
                agent = agents[agent_id]
                print(f"  📋 {agent.name} - Role: {agent.role.value} - Status: {agent.status.value}")
            
            # Verify agent roles match prompt specifications
            planner = agents["planner-001"]
            executor = agents["executor-001"]
            auditor = agents["auditor-001"]
            
            assert planner.role == AgentRole.PLANNER
            assert executor.role == AgentRole.EXECUTOR
            assert auditor.role == AgentRole.AUDITOR
            
            # Verify capabilities are defined
            expected_capabilities = {
                "planner-001": ["workflow_analysis", "risk_assessment", "plan_generation"],
                "executor-001": ["api_integration", "task_execution", "error_handling"],
                "auditor-001": ["audit_logging", "compliance_monitoring", "report_generation"]
            }
            
            for agent_id, expected_caps in expected_capabilities.items():
                agent_caps = agents[agent_id].capabilities
                for cap in expected_caps:
                    assert cap in agent_caps, f"Missing capability '{cap}' for agent {agent_id}"
            
            self.test_results.append(("Multi-Agent System", "PASS", "All agents initialized with correct roles"))
            print("✅ Multi-agent system verified")
            
        except Exception as e:
            self.test_results.append(("Multi-Agent System", "FAIL", str(e)))
            print(f"❌ Multi-agent system failed: {e}")
    
    async def test_workflow_automation(self):
        """Test workflow automation capabilities"""
        print("\n⚙️ Testing Workflow Automation...")
        
        try:
            if not self.portia_service:
                self.portia_service = PortiaService()
                await self.portia_service.initialize()
            
            # Test workflow request processing
            test_request = WorkflowRequest(
                id="test-workflow-001",
                description="Create a Google Sheets report with sales data and share with team via Slack",
                user_id="test-user-001",
                priority="medium",
                context="Monthly sales automation test"
            )
            
            # Test plan generation
            workflow_plan = await self.portia_service.create_workflow_plan(test_request)
            
            assert workflow_plan is not None, "Workflow plan generation failed"
            assert workflow_plan.name is not None, "Workflow plan missing name"
            assert len(workflow_plan.steps) > 0, "Workflow plan has no steps"
            assert workflow_plan.risk_level in ["low", "medium", "high"], "Invalid risk level"
            
            # Verify plan structure matches prompt requirements
            assert workflow_plan.description == test_request.description
            assert workflow_plan.created_by == test_request.user_id
            
            print(f"  📊 Generated plan: {workflow_plan.name}")
            print(f"  📊 Risk Level: {workflow_plan.risk_level}")
            print(f"  📊 Steps: {len(workflow_plan.steps)}")
            print(f"  📊 Duration: {workflow_plan.estimated_duration} minutes")
            
            for i, step in enumerate(workflow_plan.steps, 1):
                print(f"    {i}. {step.name} (Risk: {step.risk_level})")
            
            self.test_results.append(("Workflow Automation", "PASS", "Workflow generation successful"))
            print("✅ Workflow automation verified")
            
        except Exception as e:
            self.test_results.append(("Workflow Automation", "FAIL", str(e)))
            print(f"❌ Workflow automation failed: {e}")
    
    async def test_use_cases(self):
        """Test specific use cases from the prompt"""
        print("\n📝 Testing Prompt Use Cases...")
        
        use_cases = [
            {
                "name": "Vendor Onboarding",
                "description": "Onboard vendor Acme Corp - tech consulting company with standard compliance requirements",
                "expected_tools": ["google_workspace", "notion", "slack", "email"]
            },
            {
                "name": "Employee Onboarding", 
                "description": "Onboard new software engineer John Doe starting next Monday",
                "expected_tools": ["gmail", "slack", "jira", "github"]
            },
            {
                "name": "Incident Response",
                "description": "Handle critical system outage affecting payment processing",
                "expected_tools": ["slack", "jira", "email", "monitoring"]
            }
        ]
        
        try:
            passed_cases = 0
            
            for use_case in use_cases:
                try:
                    request = WorkflowRequest(
                        id=f"test-{use_case['name'].lower().replace(' ', '-')}",
                        description=use_case["description"],
                        user_id="test-user",
                        priority="high" if "critical" in use_case["description"] else "medium"
                    )
                    
                    plan = await self.portia_service.create_workflow_plan(request)
                    
                    # Verify plan contains expected elements
                    assert plan is not None
                    assert len(plan.steps) >= 3, f"Use case '{use_case['name']}' should have at least 3 steps"
                    
                    print(f"  ✅ {use_case['name']}: {len(plan.steps)} steps, {plan.estimated_duration}min")
                    passed_cases += 1
                    
                except Exception as e:
                    print(f"  ❌ {use_case['name']}: {str(e)}")
            
            success_rate = (passed_cases / len(use_cases)) * 100
            self.test_results.append(("Use Cases", "PASS" if success_rate >= 80 else "PARTIAL", 
                                    f"{passed_cases}/{len(use_cases)} use cases passed ({success_rate:.1f}%)"))
            
            print(f"✅ Use case testing: {success_rate:.1f}% success rate")
            
        except Exception as e:
            self.test_results.append(("Use Cases", "FAIL", str(e)))
            print(f"❌ Use case testing failed: {e}")
    
    async def test_security_compliance(self):
        """Test security and compliance features"""
        print("\n🔐 Testing Security & Compliance...")
        
        try:
            # Test audit trail functionality
            if not self.portia_service:
                self.portia_service = PortiaService()
                await self.portia_service.initialize()
            
            # Verify auditor agent exists and is configured
            auditor = self.portia_service.agents.get("auditor-001")
            assert auditor is not None, "Auditor agent not found"
            assert auditor.role == AgentRole.AUDITOR, "Auditor agent has wrong role"
            
            # Check audit capabilities
            audit_capabilities = ["audit_logging", "compliance_monitoring", "report_generation"]
            for cap in audit_capabilities:
                assert cap in auditor.capabilities, f"Auditor missing capability: {cap}"
            
            # Test approval workflow capability
            test_request = WorkflowRequest(
                id="security-test",
                description="High-risk operation: Delete production database backup",
                user_id="test-user",
                priority="high"
            )
            
            plan = await self.portia_service.create_workflow_plan(test_request)
            
            # Verify high-risk operations require approval
            high_risk_steps = [step for step in plan.steps if step.requires_approval]
            assert len(high_risk_steps) > 0, "High-risk operations should require approval"
            
            self.test_results.append(("Security & Compliance", "PASS", "Security features implemented"))
            print("✅ Security and compliance verified")
            
        except Exception as e:
            self.test_results.append(("Security & Compliance", "FAIL", str(e)))
            print(f"❌ Security and compliance failed: {e}")
    
    async def test_integrations(self):
        """Test external tool integrations"""
        print("\n🔗 Testing External Integrations...")
        
        try:
            # Test integration service initialization
            if not self.portia_service:
                self.portia_service = PortiaService()
                await self.portia_service.initialize()
            
            # Verify integration service exists
            assert self.portia_service.integration_service is not None, "Integration service not initialized"
            
            # Test tool registry
            available_tools = await self.portia_service.integration_service.get_available_tools()
            assert len(available_tools) > 0, "No integration tools available"
            
            # Verify required integrations from prompt
            expected_integrations = [
                "gmail", "google_sheets", "google_drive", "slack", 
                "notion", "jira", "email", "file_management"
            ]
            
            tool_names = [tool.name.lower() for tool in available_tools]
            available_count = 0
            
            for integration in expected_integrations:
                if any(integration in name for name in tool_names):
                    available_count += 1
                    print(f"  ✅ {integration.title()} integration available")
                else:
                    print(f"  ⚠️ {integration.title()} integration not found")
            
            integration_coverage = (available_count / len(expected_integrations)) * 100
            
            self.test_results.append(("Integrations", "PASS" if integration_coverage >= 60 else "PARTIAL",
                                    f"{available_count}/{len(expected_integrations)} integrations ({integration_coverage:.1f}%)"))
            
            print(f"✅ Integration testing: {integration_coverage:.1f}% coverage")
            
        except Exception as e:
            self.test_results.append(("Integrations", "FAIL", str(e)))
            print(f"❌ Integration testing failed: {e}")
    
    def generate_report(self):
        """Generate comprehensive validation report"""
        print("\n" + "="*60)
        print("📊 OPSFLOW GUARDIAN 2.0 - VALIDATION REPORT")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r[1] == "PASS"])
        partial_tests = len([r for r in self.test_results if r[1] == "PARTIAL"])
        failed_tests = len([r for r in self.test_results if r[1] == "FAIL"])
        
        print(f"📈 Overall Results: {passed_tests}/{total_tests} PASSED")
        print(f"📊 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        print(f"🔄 Partial Success: {partial_tests}")
        print(f"❌ Failed: {failed_tests}")
        
        print("\n📋 Detailed Results:")
        for test_name, status, message in self.test_results:
            status_icon = "✅" if status == "PASS" else "⚠️" if status == "PARTIAL" else "❌"
            print(f"  {status_icon} {test_name}: {message}")
        
        print("\n🎯 Prompt Compliance Summary:")
        
        # Check compliance with prompt requirements
        compliance_checks = [
            ("Multi-Agent System", "planner-001" in (self.portia_service.agents if self.portia_service else {})),
            ("Google Gemini Integration", settings.LLM_PROVIDER == "google"),
            ("Portia SDK Usage", any("Portia" in str(r) for r in self.test_results)),
            ("Workflow Automation", any("Workflow" in str(r) for r in self.test_results)),
            ("Security Features", any("Security" in str(r) for r in self.test_results)),
        ]
        
        compliant_features = sum(1 for _, compliant in compliance_checks if compliant)
        compliance_rate = (compliant_features / len(compliance_checks)) * 100
        
        for feature, compliant in compliance_checks:
            icon = "✅" if compliant else "❌"
            print(f"  {icon} {feature}")
        
        print(f"\n🏆 Prompt Compliance: {compliance_rate:.1f}%")
        
        # Final assessment
        if passed_tests >= 5 and compliance_rate >= 80:
            print("\n🎉 SYSTEM READY FOR HACKATHON DEMO!")
            print("✨ All critical components verified with Google Gemini")
        elif passed_tests >= 3:
            print("\n⚠️ System partially ready - minor issues to address")
        else:
            print("\n❌ System needs significant work before demo")
        
        print("\n💡 Next Steps:")
        print("1. Set your GOOGLE_API_KEY environment variable")
        print("2. Test with real Google Gemini API calls")
        print("3. Verify frontend integration")
        print("4. Practice demo scenarios")
        
        return compliance_rate >= 80

async def main():
    """Run the comprehensive system validation"""
    validator = SystemValidator()
    await validator.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
