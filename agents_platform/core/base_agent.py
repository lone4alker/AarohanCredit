"""
Base agent class that all specialized agents inherit from.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import logging
from datetime import datetime

from .types import AgentInput, AgentOutput
from .config import settings


logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """
    Base class for all agents in the system.
    
    Each agent should:
    1. Inherit from BaseAgent
    2. Implement the run() method
    3. Optionally override validate_input() and process()
    """
    
    def __init__(self, name: str, description: str = ""):
        """
        Initialize the agent.
        
        Args:
            name: Unique name for the agent
            description: Human-readable description of the agent's purpose
        """
        self.name = name
        self.description = description
        self.logger = logging.getLogger(f"{__name__}.{name}")
    
    @abstractmethod
    def run(self, input_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> AgentOutput:
        """
        Main entry point for the agent.
        
        Args:
            input_data: Input data dictionary
            context: Optional context dictionary for additional information
            
        Returns:
            AgentOutput with success status, data, and any errors
        """
        pass
    
    def validate_input(self, input_data: Dict[str, Any]) -> tuple[bool, list[str]]:
        """
        Validate input data. Override in subclasses for specific validation.
        
        Args:
            input_data: Input data to validate
            
        Returns:
            Tuple of (is_valid, list_of_errors)
        """
        if not input_data:
            return False, ["Input data is empty"]
        return True, []
    
    def log_step(self, step: str, data: Any = None):
        """Log an agent reasoning step."""
        self.logger.info(f"[{self.name}] {step}")
        if data:
            self.logger.debug(f"[{self.name}] Data: {data}")
    
    def create_output(
        self,
        success: bool,
        data: Dict[str, Any],
        errors: Optional[list[str]] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AgentOutput:
        """
        Create a standardized agent output.
        
        Args:
            success: Whether the operation succeeded
            data: Output data dictionary
            errors: List of error messages
            metadata: Additional metadata
            
        Returns:
            AgentOutput instance
        """
        return AgentOutput(
            success=success,
            data=data,
            errors=errors or [],
            metadata=metadata or {}
        )

