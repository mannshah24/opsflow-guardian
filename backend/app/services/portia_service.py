"""
Portia SDK Integration Service for OpsFlow Guardian 2.0
Handles multi-agent orchestration, workflow planning, and execution
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime
import json
import uuid

from portia import Portia, Config, LLMProvider, StorageClass
from portia.open_source_tools.registry import example_tool_registry

from app.core.config import settings, get_llm_provider
from app.models.workflow import WorkflowRequest, WorkflowPlan, WorkflowExecution, WorkflowStep
from app.models.agent import Agent, AgentRole, AgentStatus
from app.services.redis_service import RedisService
from app.services.integration_service import IntegrationService

logger = logging.getLogger(__name__)


class PortiaService:
    """Service for managing Portia SDK integration and multi-agent workflows"""
    
    def __init__(self):
        self.portia_client = None
        self.redis_service = None
        self.integration_service = None
        self.agents: Dict[str, Agent] = {}
        self.active_workflows: Dict[str, WorkflowExecution] = {}
        self._initialized = False
    
    async def initialize(self):
        """Initialize Portia service"""
        if self._initialized:
            return
        
        try:
            logger.info("Initializing Portia service...")
            
            # Initialize Redis service
            self.redis_service = RedisService()
            await self.redis_service.initialize()
            
            # Initialize integration service
            self.integration_service = IntegrationService()
            await self.integration_service.initialize()
            
            # Setup Portia configuration
            portia_config = await self._setup_portia_config()
            
            # Initialize Portia client with enhanced tool registry
            enhanced_tools = await self._create_enhanced_tool_registry()
            self.portia_client = Portia(config=portia_config, tools=enhanced_tools)
            
            # Initialize multi-agent system
            await self._initialize_agents()
            
            self._initialized = True
            logger.info("Portia service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Portia service: {e}")
            raise
    
    async def _setup_portia_config(self) -> Config:
        """Setup Portia configuration"""
        llm_provider = get_llm_provider()
        
        config_kwargs = {
            "llm_provider": llm_provider,
            "storage_class": StorageClass.CLOUD if settings.PORTIA_API_KEY else StorageClass.MEMORY,
            "default_log_level": settings.LOG_LEVEL,
            "llm_redis_cache_url": settings.REDIS_CACHE_URL if settings.REDIS_CACHE_URL else None
        }
        
        # Add API keys based on provider
        if llm_provider == "openai" and settings.OPENAI_API_KEY:
            config_kwargs["openai_api_key"] = settings.OPENAI_API_KEY
        elif llm_provider == "anthropic" and settings.ANTHROPIC_API_KEY:
            config_kwargs["anthropic_api_key"] = settings.ANTHROPIC_API_KEY
        elif llm_provider == "google" and settings.GOOGLE_API_KEY:
            config_kwargs["google_api_key"] = settings.GOOGLE_API_KEY
        
        # Add Portia API key if available
        if settings.PORTIA_API_KEY:
            config_kwargs["portia_api_key"] = settings.PORTIA_API_KEY
        
        return Config.from_default(**config_kwargs)
    
    async def _create_enhanced_tool_registry(self):
        """Create enhanced tool registry with external integrations"""
        # Start with example tools
        tools = example_tool_registry
        
        # Add custom tools from integration service
        custom_tools = await self.integration_service.get_available_tools()
        for tool in custom_tools:
            tools.add_tool(tool)
        
        return tools
    
    async def _initialize_agents(self):
        """Initialize the multi-agent system"""
        # Planner Agent
        planner_agent = Agent(
            id="planner-001",
            name="Workflow Planner",
            role=AgentRole.PLANNER,
            status=AgentStatus.ACTIVE,
            description="Analyzes requests and generates detailed execution plans with risk assessment",
            capabilities=[
                "natural_language_processing",
                "workflow_planning",
                "risk_assessment",
                "plan_optimization"
            ],
            config={
                "max_plan_steps": settings.MAX_WORKFLOW_STEPS,
                "risk_threshold": 0.7,
                "planning_model": get_llm_provider()
            }
        )
        
        # Executor Agent
        executor_agent = Agent(
            id="executor-001",
            name="Workflow Executor",
            role=AgentRole.EXECUTOR,
            status=AgentStatus.ACTIVE,
            description="Executes approved workflow plans with real-time monitoring",
            capabilities=[
                "api_integration",
                "parallel_execution",
                "error_handling",
                "progress_tracking"
            ],
            config={
                "max_concurrent_executions": settings.MAX_CONCURRENT_WORKFLOWS,
                "execution_timeout": settings.MAX_EXECUTION_TIME_MINUTES * 60,
                "retry_attempts": 3
            }
        )
        
        # Auditor Agent
        auditor_agent = Agent(
            id="auditor-001",
            name="Compliance Auditor",
            role=AgentRole.AUDITOR,
            status=AgentStatus.ACTIVE,
            description="Monitors all activities and maintains comprehensive audit trails",
            capabilities=[
                "activity_monitoring",
                "compliance_checking",
                "audit_logging",
                "anomaly_detection"
            ],
            config={
                "audit_level": "comprehensive",
                "retention_days": 365,
                "encryption_enabled": True
            }
        )
        
        # Store agents
        self.agents = {
            agent.id: agent for agent in [planner_agent, executor_agent, auditor_agent]
        }
        
        # Store agent status in Redis
        for agent_id, agent in self.agents.items():
            await self.redis_service.set_json(f"agent:{agent_id}", agent.model_dump())
        
        logger.info(f"Initialized {len(self.agents)} agents")
    
    async def create_workflow_plan(self, request: WorkflowRequest) -> WorkflowPlan:
        """Create a workflow plan using the Planner Agent"""
        try:
            logger.info(f"Creating workflow plan for request: {request.description}")
            
            # Get planner agent
            planner = self.agents.get("planner-001")
            if not planner:
                raise ValueError("Planner agent not available")
            
            # Update agent status
            planner.status = AgentStatus.WORKING
            await self.redis_service.set_json(f"agent:{planner.id}", planner.model_dump())
            
            # Create enhanced prompt for planning
            planning_prompt = self._create_planning_prompt(request)
            
            # Use Portia to generate the plan
            plan_run = self.portia_client.run(planning_prompt)
            
            # Parse the plan from Portia response
            workflow_plan = await self._parse_portia_plan(plan_run, request)
            
            # Store the plan
            await self.redis_service.set_json(f"plan:{workflow_plan.id}", workflow_plan.model_dump())
            
            # Update agent status back to active
            planner.status = AgentStatus.ACTIVE
            await self.redis_service.set_json(f"agent:{planner.id}", planner.model_dump())
            
            logger.info(f"Created workflow plan {workflow_plan.id} with {len(workflow_plan.steps)} steps")
            return workflow_plan
            
        except Exception as e:
            logger.error(f"Failed to create workflow plan: {e}")
            # Reset agent status on error
            if 'planner' in locals():
                planner.status = AgentStatus.ERROR
                await self.redis_service.set_json(f"agent:{planner.id}", planner.model_dump())
            raise
    
    def _create_planning_prompt(self, request: WorkflowRequest) -> str:
        """Create an enhanced prompt for workflow planning"""
        return f"""
You are the Planner Agent in OpsFlow Guardian 2.0. Create a detailed, actionable workflow plan for the following request:

REQUEST: {request.description}

CONTEXT:
- User: {request.user_id}
- Priority: {request.priority}
- Additional Context: {request.context or 'None provided'}

REQUIREMENTS:
1. Break down the request into specific, actionable steps
2. Identify which external tools/services need to be integrated
3. Assess risks for each step (LOW, MEDIUM, HIGH)
4. Specify approval requirements for high-risk actions
5. Estimate execution time for each step
6. Include error handling and rollback procedures

AVAILABLE INTEGRATIONS:
- Google Workspace (Gmail, Sheets, Drive, Calendar)
- Slack (messaging, notifications)
- Notion (workspace creation, documentation)
- Jira (ticket management, project tracking)
- Email services (notifications, communications)

OUTPUT FORMAT:
Provide a structured plan with:
- Executive summary
- Risk assessment (overall risk level)
- Step-by-step breakdown with:
  * Step description
  * Required tools/integrations
  * Risk level
  * Approval required (yes/no)
  * Estimated duration
  * Success criteria
- Dependencies between steps
- Rollback procedures
- Human approval checkpoints

Be specific and actionable. Consider error scenarios and provide contingency plans.
        """.strip()
    
    async def _parse_portia_plan(self, plan_run, request: WorkflowRequest) -> WorkflowPlan:
        """Parse Portia plan run response into WorkflowPlan"""
        try:
            # Extract the final output from plan run
            plan_content = plan_run.final_output.get("value", "") if plan_run.final_output else ""
            
            # Create workflow plan
            plan = WorkflowPlan(
                id=str(uuid.uuid4()),
                request_id=request.id,
                name=f"Workflow: {request.description[:50]}...",
                description=request.description,
                created_by=request.user_id,
                status="pending_approval",
                risk_level="medium",  # Will be parsed from plan content
                estimated_duration=30,  # Will be calculated from steps
                steps=[],
                metadata={
                    "portia_plan_id": plan_run.plan_id,
                    "portia_run_id": plan_run.id,
                    "original_request": request.model_dump()
                }
            )
            
            # Parse steps from plan content (simplified for now)
            # In a real implementation, you'd parse the structured output
            plan.steps = await self._extract_steps_from_plan(plan_content, plan.id)
            
            # Calculate risk level and duration
            plan.risk_level = self._calculate_overall_risk(plan.steps)
            plan.estimated_duration = sum(step.estimated_duration for step in plan.steps)
            
            return plan
            
        except Exception as e:
            logger.error(f"Failed to parse Portia plan: {e}")
            raise
    
    async def _extract_steps_from_plan(self, plan_content: str, plan_id: str) -> List[WorkflowStep]:
        """Extract workflow steps from plan content"""
        # This is a simplified implementation
        # In practice, you'd parse structured output from the LLM
        
        default_steps = [
            WorkflowStep(
                id=f"step-{uuid.uuid4()}",
                plan_id=plan_id,
                name="Initialize Workflow",
                description="Set up initial parameters and validate inputs",
                step_order=1,
                tool_integrations=["internal"],
                risk_level="low",
                requires_approval=False,
                estimated_duration=5,
                status="pending"
            ),
            WorkflowStep(
                id=f"step-{uuid.uuid4()}",
                plan_id=plan_id,
                name="Execute Main Task",
                description="Perform the primary workflow actions",
                step_order=2,
                tool_integrations=["google_workspace", "slack"],
                risk_level="medium",
                requires_approval=True,
                estimated_duration=20,
                status="pending"
            ),
            WorkflowStep(
                id=f"step-{uuid.uuid4()}",
                plan_id=plan_id,
                name="Finalize and Report",
                description="Complete workflow and send notifications",
                step_order=3,
                tool_integrations=["email", "audit"],
                risk_level="low",
                requires_approval=False,
                estimated_duration=5,
                status="pending"
            )
        ]
        
        return default_steps
    
    def _calculate_overall_risk(self, steps: List[WorkflowStep]) -> str:
        """Calculate overall risk level based on individual step risks"""
        risk_scores = {"low": 1, "medium": 2, "high": 3}
        max_risk = max((risk_scores.get(step.risk_level, 1) for step in steps), default=1)
        
        risk_levels = {1: "low", 2: "medium", 3: "high"}
        return risk_levels[max_risk]
    
    async def execute_workflow(self, plan: WorkflowPlan) -> WorkflowExecution:
        """Execute an approved workflow plan"""
        try:
            logger.info(f"Starting execution of workflow plan {plan.id}")
            
            # Get executor agent
            executor = self.agents.get("executor-001")
            if not executor:
                raise ValueError("Executor agent not available")
            
            # Create workflow execution
            execution = WorkflowExecution(
                id=str(uuid.uuid4()),
                plan_id=plan.id,
                status="running",
                started_at=datetime.utcnow(),
                executed_by="executor-001",
                current_step_index=0,
                step_results={}
            )
            
            # Store execution
            self.active_workflows[execution.id] = execution
            await self.redis_service.set_json(f"execution:{execution.id}", execution.model_dump())
            
            # Update executor status
            executor.status = AgentStatus.WORKING
            await self.redis_service.set_json(f"agent:{executor.id}", executor.model_dump())
            
            # Execute steps sequentially
            for i, step in enumerate(plan.steps):
                execution.current_step_index = i
                await self._execute_step(execution, step)
                
                # Update progress
                await self.redis_service.set_json(f"execution:{execution.id}", execution.model_dump())
            
            # Mark execution as completed
            execution.status = "completed"
            execution.completed_at = datetime.utcnow()
            
            # Update executor status back to active
            executor.status = AgentStatus.ACTIVE
            await self.redis_service.set_json(f"agent:{executor.id}", executor.model_dump())
            
            logger.info(f"Completed execution of workflow {execution.id}")
            return execution
            
        except Exception as e:
            logger.error(f"Failed to execute workflow: {e}")
            if 'execution' in locals():
                execution.status = "failed"
                execution.error_message = str(e)
                await self.redis_service.set_json(f"execution:{execution.id}", execution.model_dump())
            raise
    
    async def _execute_step(self, execution: WorkflowExecution, step: WorkflowStep):
        """Execute a single workflow step"""
        try:
            logger.info(f"Executing step {step.name} for workflow {execution.id}")
            
            step_start_time = datetime.utcnow()
            
            # Simulate step execution (replace with actual integration calls)
            await self._simulate_step_execution(step)
            
            # Record step result
            step_result = {
                "status": "completed",
                "started_at": step_start_time.isoformat(),
                "completed_at": datetime.utcnow().isoformat(),
                "output": f"Successfully completed {step.name}",
                "tools_used": step.tool_integrations
            }
            
            execution.step_results[step.id] = step_result
            
        except Exception as e:
            logger.error(f"Failed to execute step {step.name}: {e}")
            step_result = {
                "status": "failed",
                "error": str(e),
                "started_at": step_start_time.isoformat(),
                "failed_at": datetime.utcnow().isoformat()
            }
            execution.step_results[step.id] = step_result
            raise
    
    async def _simulate_step_execution(self, step: WorkflowStep):
        """Simulate step execution (replace with actual tool integrations)"""
        # Simulate processing time
        await asyncio.sleep(2)
        
        # Here you would call actual integration services based on step.tool_integrations
        logger.info(f"Simulated execution of step: {step.name} using tools: {step.tool_integrations}")
    
    async def get_agent_status(self, agent_id: str) -> Optional[Agent]:
        """Get current status of an agent"""
        try:
            agent_data = await self.redis_service.get_json(f"agent:{agent_id}")
            if agent_data:
                return Agent(**agent_data)
            return None
        except Exception as e:
            logger.error(f"Failed to get agent status: {e}")
            return None
    
    async def get_all_agents(self) -> List[Agent]:
        """Get status of all agents"""
        try:
            agents = []
            for agent_id in self.agents.keys():
                agent = await self.get_agent_status(agent_id)
                if agent:
                    agents.append(agent)
            return agents
        except Exception as e:
            logger.error(f"Failed to get all agents: {e}")
            return list(self.agents.values())
    
    async def get_workflow_execution(self, execution_id: str) -> Optional[WorkflowExecution]:
        """Get workflow execution details"""
        try:
            execution_data = await self.redis_service.get_json(f"execution:{execution_id}")
            if execution_data:
                return WorkflowExecution(**execution_data)
            return None
        except Exception as e:
            logger.error(f"Failed to get workflow execution: {e}")
            return None
