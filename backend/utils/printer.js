// backend/utils/printer.js

// MCP summary (from Sonar response before dispatching)
export function printAgents(mcpArray) {
    if (mcpArray.length === 0) {
      console.log("⚠️ No relevant departments detected.");
      return;
    }
  
    console.log("\n🧠 Departments to Activate:");
    mcpArray.forEach((a, i) => {
      console.log(`\n${i + 1}. ${a.agent}`);
      console.log(`   - Objective: ${a.objective}`);
      if (a.location) console.log(`   - Location: ${a.location}`);
      console.log(`   - Context: ${a.context}`);
      console.log(`   - Priority: ${a.priority}`);
    });
  }
  
  // Individual agent output (after handler runs)
  export function printAgentResponse(agentName, responseText) {
    console.log(`\n🔧 ${agentName} Agent Response:\n`);
    console.log(responseText);
  }
  