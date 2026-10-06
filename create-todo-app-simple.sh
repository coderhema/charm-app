#!/bin/bash

: "${CHARM_TOKEN:?Set CHARM_TOKEN environment variable first}"
API_URL="https://charm.ing"

echo "=== Creating Todo List App ==="
echo "Using your signed-in account..."

# Create the module (backend)
MODULE='export const manifest = {
  "$schema": "https://charm.ing/schema/app-manifest/2026-07-31.json",
  "id": "todo-list",
  "meta": {
    "name": "Todo List",
    "icon": { "emoji": "📝", "bg": "#3b82f6" }
  },
  "capabilities": {
    "imports": ["charming:storage/kv@1.0"]
  }
};

export const routes = [
  {
    "op": "list",
    "method": "GET",
    "annotations": { "readOnlyHint": true },
    "outputSchema": { "type": "array" },
    "handler": async (_input, { env }) => (await env.storage.get("todos")) ?? []
  },
  {
    "op": "add",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["text"],
      "properties": { 
        "text": { "type": "string" },
        "completed": { "type": "boolean", "default": false }
      },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const todos = (await env.storage.get("todos")) ?? [];
      const newTodo = {
        id: crypto.randomUUID(),
        text: input.text,
        completed: input.completed || false,
        createdAt: new Date().toISOString()
      };
      todos.push(newTodo);
      await env.storage.put("todos", todos);
      return newTodo;
    }
  },
  {
    "op": "toggle",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["id"],
      "properties": { 
        "id": { "type": "string" }
      },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const todos = (await env.storage.get("todos")) ?? [];
      const updatedTodos = todos.map(todo => 
        todo.id === input.id ? { ...todo, completed: !todo.completed } : todo
      );
      await env.storage.put("todos", updatedTodos);
      return updatedTodos.find(todo => todo.id === input.id);
    }
  },
  {
    "op": "delete",
    "method": "POST",
    "inputSchema": {
      "type": "object",
      "required": ["id"],
      "properties": { 
        "id": { "type": "string" }
      },
      "additionalProperties": false
    },
    "handler": async (input, { env }) => {
      const todos = (await env.storage.get("todos")) ?? [];
      const updatedTodos = todos.filter(todo => todo.id !== input.id);
      await env.storage.put("todos", updatedTodos);
      return { deleted: true, id: input.id };
    }
  }
];'

# Create the UI (frontend)
UI='const { api } = window.charming;

const app = document.getElementById("app");
app.className = "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8";

async function loadTodos() {
  try {
    const todos = await api.list();
    renderTodos(todos);
  } catch (error) {
    console.error("Failed to load todos:", error);
    app.innerHTML = "<div class=\"p-4 text-red-600\">Failed to load todos. Please refresh.</div>";
  }
}

function renderTodos(todos) {
  app.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span class="text-blue-600">📝</span> Todo List
        </h1>
        <p class="text-gray-600 mb-6">A simple todo app that saves your tasks</p>
        
        <div class="flex gap-2 mb-6">
          <input type="text" id="newTodoInput" 
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="What needs to be done?" 
            onkeydown="if(event.key === \"Enter\") addTodo()">
          <button onclick="addTodo()" 
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            Add
          </button>
        </div>
        
        <div id="todoList" class="space-y-3">
          ${todos.length === 0 ? `
            <div class="text-center py-8 text-gray-500">
              <div class="text-4xl mb-2">📋</div>
              <p>No todos yet. Add your first task above!</p>
            </div>
          ` : ""}
        </div>
      </div>
      
      <div class="text-center text-gray-500 text-sm">
        Built with <a href="https://charm.ing" target="_blank" class="text-blue-600 hover:underline">Charming</a>
      </div>
    </div>
  `;
  
  const todoList = document.getElementById("todoList");
  if (todos.length > 0) {
    todoList.innerHTML = todos.map(todo => `
      <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group" data-id="${todo.id}">
        <button onclick="toggleTodo('\${todo.id}')" 
          class="flex-shrink-0 w-6 h-6 rounded-full border-2 \${todo.completed ? "bg-green-500 border-green-500" : "border-gray-300"} 
                 flex items-center justify-center transition-colors">
          \${todo.completed ? "✓" : ""}
        </button>
        <span class="flex-1 \${todo.completed ? "line-through text-gray-500" : "text-gray-800"}">
          \${escapeHtml(todo.text)}
        </span>
        <button onclick="deleteTodo('\${todo.id}')" 
          class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1">
          ×
        </button>
      </div>
    `).join("");
  }
}

async function addTodo() {
  const input = document.getElementById("newTodoInput");
  const text = input.value.trim();
  
  if (!text) return;
  
  input.disabled = true;
  
  try {
    await api.add({ text });
    input.value = "";
    await loadTodos();
  } catch (error) {
    console.error("Failed to add todo:", error);
    alert("Failed to add todo. Please try again.");
  } finally {
    input.disabled = false;
    input.focus();
  }
}

async function toggleTodo(id) {
  try {
    await api.toggle({ id });
    await loadTodos();
  } catch (error) {
    console.error("Failed to toggle todo:", error);
  }
}

async function deleteTodo(id) {
  if (!confirm("Delete this todo?")) return;
  
  try {
    await api.delete({ id });
    await loadTodos();
  } catch (error) {
    console.error("Failed to delete todo:", error);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize
loadTodos();

window.addTodo = addTodo;
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;'

# Create a temporary file with the JSON payload
cat > /tmp/payload.json << PAYLOAD_EOF
{
  "module": "$(echo "$MODULE" | sed 's/"/\\"/g')",
  "ui": "$(echo "$UI" | sed 's/"/\\"/g')",
  "label": "Todo List App"
}
PAYLOAD_EOF

# Make the HTTP request
echo "Creating app..."
RESPONSE=$(curl -s -X POST "$API_URL/app" \
  -H "Authorization: Bearer $CHARM_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/payload.json)

echo -e "\nResponse:"
echo "$RESPONSE"

# Clean up
rm -f /tmp/payload.json

# Check if successful
if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo -e "\n✅ App created successfully!"
    
    # Try to extract URL
    URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$URL" ]; then
        echo "🔗 App URL: $URL"
        echo "Open this URL in your browser to use your todo list!"
    fi
    
    # Try to extract token
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$TOKEN" ]; then
        echo "🔑 App token: ${TOKEN:0:20}..."
    fi
else
    echo -e "\n❌ Failed to create app"
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    ERROR_KIND=$(echo "$RESPONSE" | grep -o '"kind":"[^"]*"' | cut -d'"' -f4)
    echo "Error kind: $ERROR_KIND"
    echo "Error message: $ERROR_MSG"
fi

