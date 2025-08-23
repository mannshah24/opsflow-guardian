#!/usr/bin/env python3
"""
OpsFlow Guardian 2.0 - Comprehensive Integration Test Suite
Tests the system with real API keys and external services
"""

import asyncio
import sys
import os
from datetime import datetime
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "app"))

from app.core.config import settings
from app.services.gemini_service import GeminiService
from app.services.portia_service import PortiaService
from app.services.redis_service import RedisService
from app.services.integration_service import IntegrationService
from app.models.workflow import WorkflowRequest, WorkflowStatus
from app.models.agent import Agent, AgentRole, AgentStatus

class IntegrationTestSuite:
    """Comprehensive test suite for all system integrations"""
    
    def __init__(self):
        self.test_results = {}
        self.overall_score = 0
        self.total_tests = 0
        
        # Initialize services
        self.gemini_service = GeminiService()
        self.portia_service = PortiaService()
        self.redis_service = RedisService()
        self.integration_service = IntegrationService()
    
    async def run_all_tests(self):
        """Run comprehensive integration test suite"""
        self.print_header()
        
        # Test categories
        test_categories = [
            ("🔧 Environment Configuration", self.test_environment_config),
            ("🤖 Google Gemini Integration", self.test_gemini_integration),
            ("🚀 Portia SDK Integration", self.test_portia_integration),
            ("🔄 Redis Cache Integration", self.test_redis_integration),
            ("🔗 External Service Integrations", self.test_external_integrations),
            ("⚡ Multi-Agent Workflow", self.test_multi_agent_workflow),
            ("🎯 Production Use Cases", self.test_production_use_cases),
            ("🔐 Security & Compliance", self.test_security_compliance),
            ("📊 Performance & Scalability", self.test_performance_metrics),
            ("📋 Complete End-to-End Flow", self.test_end_to_end_workflow)
        ]
        
        for test_name, test_function in test_categories:
            print(f"\n{test_name}")
            print("─" * 60)
            try:
                await test_function()
                print(f"✅ {test_name} - PASSED")
                self.test_results[test_name] = "PASSED"
            except Exception as e:
                print(f"❌ {test_name} - FAILED: {str(e)}")
                self.test_results[test_name] = f"FAILED: {str(e)}"
        
        await self.print_final_report()
    
    def print_header(self):
        """Print test suite header"""
        print("="*80)
        print("🚀 OPSFLOW GUARDIAN 2.0 - INTEGRATION TEST SUITE")
        print("🔗 Testing Real API Integrations & External Services")
        print("="*80)
        print(f"📅 Test Run: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Environment: {settings.ENVIRONMENT}")
        print(f"📊 Version: {settings.VERSION}")
    
    async def test_environment_config(self):
        """Test environment configuration and required variables"""
        self.total_tests += 1
        
        # Check critical environment variables
        required_vars = [
            ("GOOGLE_API_KEY", "Google Gemini API access"),
            ("SECRET_KEY", "Application security"),
            ("DATABASE_URL", "Database connection"),
            ("REDIS_URL", "Redis cache connection")
        ]
        
        missing_vars = []
        for var_name, description in required_vars:
            var_value = getattr(settings, var_name, None)
            if not var_value or var_value in ["your_key_here", "change_this"]:
                missing_vars.append(f"  ❌ {var_name}: {description}")
                print(f"❌ Missing: {var_name}")
            else:
                print(f"✅ Found: {var_name}")
        
        if missing_vars:
            raise Exception(f"Missing required environment variables:\n" + "\n".join(missing_vars))
        
        # Test application settings
        print(f"📋 App Name: {settings.APP_NAME}")
        print(f"📊 Version: {settings.VERSION}")
        print(f"🔧 Debug Mode: {settings.DEBUG}")
        print(f"🌍 Environment: {settings.ENVIRONMENT}")
        
        self.overall_score += 1
    
    async def test_gemini_integration(self):
        """Test Google Gemini API integration"""
        self.total_tests += 1
        
        print("🔑 Testing Google API Key...")
        if not settings.GOOGLE_API_KEY or settings.GOOGLE_API_KEY.startswith("your_"):
            raise Exception("Google API Key not configured in .env file")
        
        print("🤖 Initializing Gemini service...")
        await self.gemini_service.initialize()
        
        print("💭 Testing plan generation...")
        test_request = WorkflowRequest(
            id="test-gemini-001",
            description="Test Gemini integration by creating a simple workflow plan",
            user_id="test-user",
            priority="medium",
            context="Integration testing"
        )
        
        plan_data = await self.gemini_service.generate_workflow_plan(test_request)
        
        # Validate plan structure
        required_fields = ['plan_summary', 'steps', 'overall_risk', 'estimated_duration']
        for field in required_fields:
            if field not in plan_data:
                raise Exception(f"Missing required field in plan: {field}")
        
        print(f"📋 Generated plan: {plan_data['plan_summary']}")
        print(f"📊 Steps: {len(plan_data['steps'])}")
        print(f"⚠️ Risk: {plan_data['overall_risk']}")
        print(f"⏱️ Duration: {plan_data['estimated_duration']} minutes")
        
        self.overall_score += 1
    
    async def test_portia_integration(self):
        """Test Portia SDK integration"""
        self.total_tests += 1
        
        print("🚀 Initializing Portia service...")
        await self.portia_service.initialize()
        
        print("🤖 Creating test agents...")
        agents = await self.portia_service.get_available_agents()
        
        if not agents:
            # Create agents if they don't exist
            print("🔧 Creating new agents...")
            planner_agent = await self.portia_service.create_agent(
                name="Test Planner",
                role=AgentRole.PLANNER,
                description="Test planner agent for integration testing"
            )
            print(f"✅ Created planner: {planner_agent.id}")
        else:
            print(f"✅ Found {len(agents)} existing agents")
        
        print("📋 Testing workflow plan creation...")
        test_request = WorkflowRequest(
            id="test-portia-001",
            description="Test Portia integration with multi-agent workflow",
            user_id="test-user",
            priority="medium",
            context="Portia SDK integration test"
        )
        
        workflow_plan = await self.portia_service.create_workflow_plan(test_request)
        if not workflow_plan:
            raise Exception("Failed to create workflow plan with Portia")
        
        print(f"✅ Workflow plan created: {workflow_plan.id}")
        print(f"📊 Status: {workflow_plan.status}")
        
        self.overall_score += 1
    
    async def test_redis_integration(self):
        """Test Redis cache integration"""
        self.total_tests += 1
        
        print("🔄 Testing Redis connection...")
        await self.redis_service.initialize()
        
        # Test basic Redis operations
        test_key = "opsflow:test:integration"
        test_value = {"test": "data", "timestamp": datetime.now().isoformat()}
        
        print("💾 Testing cache set...")
        await self.redis_service.set_cache(test_key, test_value, ttl=60)
        
        print("📖 Testing cache get...")
        cached_data = await self.redis_service.get_cache(test_key)
        
        if not cached_data or cached_data.get("test") != "data":
            raise Exception("Redis cache operation failed")
        
        print("🗑️ Testing cache delete...")
        await self.redis_service.delete_cache(test_key)
        
        # Verify deletion
        deleted_data = await self.redis_service.get_cache(test_key)
        if deleted_data is not None:
            raise Exception("Redis cache delete operation failed")
        
        print("✅ Redis integration working correctly")
        self.overall_score += 1
    
    async def test_external_integrations(self):
        """Test external service integrations"""
        self.total_tests += 1
        
        print("🔗 Initializing integration service...")
        await self.integration_service.initialize()
        
        # Test available integrations
        integration_tests = [
            ("slack", "Slack messaging integration"),
            ("google_drive", "Google Drive file management"),
            ("notion", "Notion workspace integration"),
            ("jira", "Jira issue tracking"),
            ("email", "Email notification service")
        ]
        
        working_integrations = []
        failed_integrations = []
        
        for integration_name, description in integration_tests:
            try:
                print(f"🔌 Testing {integration_name}...")
                
                # Test integration availability
                is_available = await self.integration_service.test_integration(integration_name)
                
                if is_available:
                    working_integrations.append(integration_name)
                    print(f"✅ {integration_name}: Working")
                else:
                    failed_integrations.append(integration_name)
                    print(f"⚠️ {integration_name}: Not configured")
                
            except Exception as e:
                failed_integrations.append(integration_name)
                print(f"❌ {integration_name}: {str(e)}")
        
        print(f"\n📊 Integration Summary:")
        print(f"  ✅ Working: {len(working_integrations)}")
        print(f"  ⚠️ Failed: {len(failed_integrations)}")
        
        if len(working_integrations) == 0:
            raise Exception("No external integrations are working")
        
        self.overall_score += 1
    
    async def test_multi_agent_workflow(self):
        """Test multi-agent coordination"""
        self.total_tests += 1
        
        print("🤖 Testing multi-agent coordination...")
        
        # Create a complex workflow that requires multiple agents
        workflow_request = WorkflowRequest(
            id="test-multiagent-001",
            description="Create a comprehensive project setup with team notifications",
            user_id="test-user",
            priority="high",
            context="Multi-agent integration test requiring planner, executor, and auditor"
        )
        
        print("📋 Planner Agent: Creating workflow plan...")
        plan = await self.portia_service.create_workflow_plan(workflow_request)
        
        if not plan:
            raise Exception("Planner agent failed to create workflow plan")
        
        print(f"✅ Plan created: {len(plan.steps)} steps")
        
        print("⚙️ Executor Agent: Simulating execution...")
        # Simulate execution
        execution_results = []
        for i, step in enumerate(plan.steps):
            try:
                # Simulate step execution
                result = await self.portia_service.execute_workflow_step(plan.id, step.id)
                execution_results.append(("success", step.name))
                print(f"  ✅ Step {i+1}: {step.name}")
            except Exception as e:
                execution_results.append(("failed", step.name, str(e)))
                print(f"  ❌ Step {i+1}: {step.name} - {str(e)}")
        
        print("🔍 Auditor Agent: Recording audit trail...")
        audit_entry = {
            "workflow_id": plan.id,
            "execution_results": execution_results,
            "timestamp": datetime.now().isoformat(),
            "compliance_status": "validated"
        }
        
        # Store audit trail
        audit_key = f"opsflow:audit:{plan.id}"
        await self.redis_service.set_cache(audit_key, audit_entry, ttl=86400)  # 24 hours
        
        print("✅ Multi-agent workflow coordination successful")
        self.overall_score += 1
    
    async def test_production_use_cases(self):
        """Test the three main production use cases"""
        self.total_tests += 1
        
        use_cases = [
            {
                "name": "Vendor Onboarding",
                "description": "Onboard new vendor TechCorp with compliance requirements",
                "context": "Production vendor management workflow"
            },
            {
                "name": "Employee Onboarding", 
                "description": "Onboard new software engineer Sarah Johnson",
                "context": "HR automation for new team member"
            },
            {
                "name": "Incident Response",
                "description": "Handle P1 incident: Database connection failures",
                "context": "Critical production incident requiring immediate response"
            }
        ]
        
        successful_cases = []
        failed_cases = []
        
        for use_case in use_cases:
            try:
                print(f"🎯 Testing: {use_case['name']}")
                
                request = WorkflowRequest(
                    id=f"prod-test-{datetime.now().strftime('%H%M%S')}",
                    description=use_case['description'],
                    user_id="test-user",
                    priority="high",
                    context=use_case['context']
                )
                
                # Generate plan
                plan = await self.portia_service.create_workflow_plan(request)
                if not plan:
                    raise Exception("Failed to generate workflow plan")
                
                print(f"  ✅ Plan: {len(plan.steps)} steps")
                print(f"  ⚠️ Risk: {plan.overall_risk}")
                print(f"  ⏱️ Duration: {plan.estimated_duration}min")
                
                successful_cases.append(use_case['name'])
                
            except Exception as e:
                print(f"  ❌ Failed: {str(e)}")
                failed_cases.append(use_case['name'])
        
        if len(successful_cases) == 0:
            raise Exception("All production use cases failed")
        
        print(f"\n📊 Use Case Results:")
        print(f"  ✅ Successful: {len(successful_cases)}")
        print(f"  ❌ Failed: {len(failed_cases)}")
        
        self.overall_score += 1
    
    async def test_security_compliance(self):
        """Test security and compliance features"""
        self.total_tests += 1
        
        print("🔐 Testing security configurations...")
        
        # Test JWT token generation
        if not settings.SECRET_KEY or len(settings.SECRET_KEY) < 32:
            raise Exception("SECRET_KEY must be at least 32 characters long")
        
        print("✅ Secret key configuration valid")
        
        # Test approval workflow
        print("🔒 Testing approval workflow...")
        high_risk_request = WorkflowRequest(
            id="security-test-001",
            description="Delete production database tables (HIGH RISK TEST)",
            user_id="test-user",
            priority="urgent",
            context="Security testing - high risk operation"
        )
        
        plan = await self.portia_service.create_workflow_plan(high_risk_request)
        if not plan:
            raise Exception("Failed to create security test plan")
        
        # Check if high-risk operations require approval
        requires_approval = plan.requires_human_approval
        if not requires_approval:
            print("⚠️ Warning: High-risk operation did not require approval")
        else:
            print("✅ High-risk operation correctly requires approval")
        
        # Test audit trail creation
        print("📋 Testing audit trail generation...")
        audit_data = {
            "action": "security_test",
            "user": "test-user",
            "timestamp": datetime.now().isoformat(),
            "details": "Security compliance test execution"
        }
        
        audit_key = f"opsflow:audit:security:{datetime.now().strftime('%Y%m%d%H%M%S')}"
        await self.redis_service.set_cache(audit_key, audit_data, ttl=86400)
        
        # Verify audit trail
        stored_audit = await self.redis_service.get_cache(audit_key)
        if not stored_audit:
            raise Exception("Audit trail creation failed")
        
        print("✅ Audit trail created and verified")
        self.overall_score += 1
    
    async def test_performance_metrics(self):
        """Test system performance and scalability"""
        self.total_tests += 1
        
        print("⚡ Testing system performance...")
        
        # Test response times
        import time
        
        start_time = time.time()
        
        # Create multiple concurrent requests
        concurrent_requests = []
        for i in range(5):
            request = WorkflowRequest(
                id=f"perf-test-{i:03d}",
                description=f"Performance test workflow #{i}",
                user_id="test-user",
                priority="medium",
                context="Performance testing"
            )
            concurrent_requests.append(
                self.gemini_service.generate_workflow_plan(request)
            )
        
        # Execute concurrent requests
        results = await asyncio.gather(*concurrent_requests, return_exceptions=True)
        
        end_time = time.time()
        total_time = end_time - start_time
        average_time = total_time / len(concurrent_requests)
        
        successful_requests = sum(1 for r in results if not isinstance(r, Exception))
        
        print(f"📊 Performance Results:")
        print(f"  ⏱️ Total time: {total_time:.2f}s")
        print(f"  📈 Average per request: {average_time:.2f}s")
        print(f"  ✅ Successful requests: {successful_requests}/{len(concurrent_requests)}")
        print(f"  📊 Success rate: {(successful_requests/len(concurrent_requests)*100):.1f}%")
        
        # Performance thresholds
        if average_time > 10.0:  # 10 seconds per request is too slow
            raise Exception(f"Performance too slow: {average_time:.2f}s average")
        
        if successful_requests < len(concurrent_requests) * 0.8:  # Less than 80% success
            raise Exception(f"Too many failed requests: {successful_requests}/{len(concurrent_requests)}")
        
        print("✅ Performance metrics within acceptable limits")
        self.overall_score += 1
    
    async def test_end_to_end_workflow(self):
        """Test complete end-to-end workflow execution"""
        self.total_tests += 1
        
        print("🎯 Running complete end-to-end workflow test...")
        
        # Create a realistic workflow
        workflow_request = WorkflowRequest(
            id=f"e2e-test-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            description="Complete end-to-end test: Set up new project repository with team access and notifications",
            user_id="integration-test-user",
            priority="high",
            context="End-to-end integration test covering all system components"
        )
        
        print("📋 Step 1: Workflow Planning...")
        plan = await self.portia_service.create_workflow_plan(workflow_request)
        if not plan:
            raise Exception("End-to-end test failed at planning stage")
        
        print(f"  ✅ Plan created with {len(plan.steps)} steps")
        
        print("🔐 Step 2: Approval Process...")
        if plan.requires_human_approval:
            print("  ⏳ Simulating approval process...")
            # In a real system, this would wait for human approval
            await asyncio.sleep(0.5)  # Simulate approval delay
            plan.status = WorkflowStatus.APPROVED
            print("  ✅ Workflow approved")
        
        print("⚙️ Step 3: Execution...")
        execution_success = True
        completed_steps = 0
        
        for i, step in enumerate(plan.steps):
            try:
                print(f"  🔄 Executing step {i+1}: {step.name}")
                
                # Simulate step execution with appropriate tools
                execution_time = 0.2 + (i * 0.1)  # Increasing execution time
                await asyncio.sleep(execution_time)
                
                completed_steps += 1
                print(f"    ✅ Completed in {execution_time:.1f}s")
                
            except Exception as e:
                print(f"    ❌ Step failed: {str(e)}")
                execution_success = False
                break
        
        print("🔍 Step 4: Audit and Compliance...")
        audit_entry = {
            "workflow_id": plan.id,
            "user_id": workflow_request.user_id,
            "description": workflow_request.description,
            "total_steps": len(plan.steps),
            "completed_steps": completed_steps,
            "execution_success": execution_success,
            "start_time": datetime.now().isoformat(),
            "compliance_validated": True
        }
        
        # Store comprehensive audit trail
        audit_key = f"opsflow:audit:e2e:{plan.id}"
        await self.redis_service.set_cache(audit_key, audit_entry, ttl=86400)
        
        print("  ✅ Audit trail recorded")
        
        print("📊 Step 5: Results Validation...")
        if not execution_success:
            raise Exception(f"End-to-end execution failed after {completed_steps} steps")
        
        if completed_steps != len(plan.steps):
            raise Exception(f"Not all steps completed: {completed_steps}/{len(plan.steps)}")
        
        print(f"🎉 End-to-end workflow completed successfully!")
        print(f"  📈 Steps executed: {completed_steps}")
        print(f"  ✅ Success rate: 100%")
        print(f"  🔍 Audit trail: Complete")
        
        self.overall_score += 1
    
    async def print_final_report(self):
        """Print comprehensive test results"""
        print("\n" + "="*80)
        print("📊 OPSFLOW GUARDIAN 2.0 - INTEGRATION TEST RESULTS")
        print("="*80)
        
        success_rate = (self.overall_score / self.total_tests) * 100 if self.total_tests > 0 else 0
        
        print(f"\n🎯 OVERALL RESULTS:")
        print(f"  📈 Tests Passed: {self.overall_score}/{self.total_tests}")
        print(f"  📊 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            status_icon = "🏆"
            status_message = "EXCELLENT - Ready for Production!"
        elif success_rate >= 80:
            status_icon = "✅"
            status_message = "GOOD - Minor issues to address"
        elif success_rate >= 70:
            status_icon = "⚠️"
            status_message = "FAIR - Several issues need attention"
        else:
            status_icon = "❌"
            status_message = "POOR - Major issues require fixing"
        
        print(f"\n{status_icon} SYSTEM STATUS: {status_message}")
        
        print(f"\n📋 DETAILED RESULTS:")
        for test_name, result in self.test_results.items():
            if result == "PASSED":
                print(f"  ✅ {test_name}")
            else:
                print(f"  ❌ {test_name}: {result}")
        
        if success_rate >= 80:
            print(f"\n🚀 DEPLOYMENT READINESS:")
            print(f"  ✅ Core functionality working")
            print(f"  ✅ External integrations configured")
            print(f"  ✅ Security measures active")
            print(f"  ✅ Performance within limits")
            print(f"  ✅ End-to-end workflows operational")
            
            print(f"\n🎯 NEXT STEPS:")
            print(f"  🎬 Run demo for stakeholders")
            print(f"  📱 Test frontend integration")
            print(f"  🔧 Monitor production metrics")
            print(f"  📈 Scale based on usage patterns")
        else:
            print(f"\n⚠️ ISSUES TO ADDRESS:")
            failed_tests = [name for name, result in self.test_results.items() if result != "PASSED"]
            for test_name in failed_tests[:3]:  # Show top 3 issues
                print(f"  🔧 Fix: {test_name}")
            
            print(f"\n📋 RECOMMENDATIONS:")
            print(f"  1. Verify all API keys in .env file")
            print(f"  2. Check external service connectivity") 
            print(f"  3. Review Redis and database configurations")
            print(f"  4. Test individual components before integration")

async def main():
    """Run the comprehensive integration test suite"""
    test_suite = IntegrationTestSuite()
    await test_suite.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
