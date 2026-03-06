use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use std::fs;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Todo {
    pub id: String,
    pub title: String,
    pub completed: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub priority: Priority,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Priority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoStore {
    pub todos: Vec<Todo>,
}

impl Default for TodoStore {
    fn default() -> Self {
        Self { todos: Vec::new() }
    }
}

pub struct AppState {
    pub store: Mutex<TodoStore>,
}

fn get_data_path(app: &AppHandle) -> std::path::PathBuf {
    let app_data = app.path().app_data_dir().expect("Failed to get app data dir");
    fs::create_dir_all(&app_data).expect("Failed to create app data dir");
    app_data.join("todos.json")
}

fn load_store(app: &AppHandle) -> TodoStore {
    let path = get_data_path(app);
    if path.exists() {
        let data = fs::read_to_string(&path).unwrap_or_default();
        serde_json::from_str(&data).unwrap_or_default()
    } else {
        TodoStore::default()
    }
}

fn save_store(app: &AppHandle, store: &TodoStore) -> Result<(), String> {
    let path = get_data_path(app);
    let data = serde_json::to_string_pretty(store).map_err(|e| e.to_string())?;
    fs::write(&path, data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_todos(app: AppHandle, state: tauri::State<AppState>) -> Result<Vec<Todo>, String> {
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    *store = load_store(&app);
    Ok(store.todos.clone())
}

#[derive(Debug, Deserialize)]
struct CreateTodoInput {
    title: String,
    priority: Priority,
    category: String,
}

#[tauri::command]
fn create_todo(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    input: CreateTodoInput,
) -> Result<Todo, String> {
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    *store = load_store(&app);

    let now = Utc::now();
    let todo = Todo {
        id: Uuid::new_v4().to_string(),
        title: input.title.trim().to_string(),
        completed: false,
        created_at: now,
        updated_at: now,
        priority: input.priority,
        category: input.category.trim().to_string(),
    };

    store.todos.push(todo.clone());
    save_store(&app, &store)?;
    Ok(todo)
}

#[derive(Debug, Deserialize)]
struct UpdateTodoInput {
    id: String,
    title: Option<String>,
    completed: Option<bool>,
    priority: Option<Priority>,
    category: Option<String>,
}

#[tauri::command]
fn update_todo(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    input: UpdateTodoInput,
) -> Result<Todo, String> {
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    *store = load_store(&app);

    let todo = store
        .todos
        .iter_mut()
        .find(|t| t.id == input.id)
        .ok_or_else(|| format!("Todo with id {} not found", input.id))?;

    if let Some(title) = input.title {
        todo.title = title.trim().to_string();
    }
    if let Some(completed) = input.completed {
        todo.completed = completed;
    }
    if let Some(priority) = input.priority {
        todo.priority = priority;
    }
    if let Some(category) = input.category {
        todo.category = category.trim().to_string();
    }
    todo.updated_at = Utc::now();

    let updated = todo.clone();
    save_store(&app, &store)?;
    Ok(updated)
}

#[tauri::command]
fn delete_todo(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<(), String> {
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    *store = load_store(&app);
    store.todos.retain(|t| t.id != id);
    save_store(&app, &store)?;
    Ok(())
}

#[tauri::command]
fn toggle_todo(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<Todo, String> {
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    *store = load_store(&app);

    let todo = store
        .todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or_else(|| format!("Todo with id {} not found", id))?;

    todo.completed = !todo.completed;
    todo.updated_at = Utc::now();

    let toggled = todo.clone();
    save_store(&app, &store)?;
    Ok(toggled)
}

#[tauri::command]
fn clear_completed(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Todo>, String> {
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    *store = load_store(&app);
    store.todos.retain(|t| !t.completed);
    save_store(&app, &store)?;
    Ok(store.todos.clone())
}

#[tauri::command]
fn reorder_todos(
    app: AppHandle,
    state: tauri::State<'_, AppState>,
    ids: Vec<String>,
) -> Result<Vec<Todo>, String> {
    let mut store = state.store.lock().map_err(|e| e.to_string())?;
    *store = load_store(&app);

    let mut reordered: Vec<Todo> = Vec::new();
    for id in &ids {
        if let Some(todo) = store.todos.iter().find(|t| &t.id == id) {
            reordered.push(todo.clone());
        }
    }
    store.todos = reordered;
    save_store(&app, &store)?;
    Ok(store.todos.clone())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .manage(AppState {
            store: Mutex::new(TodoStore::default()),
        })
        .invoke_handler(tauri::generate_handler![
            get_todos,
            create_todo,
            update_todo,
            delete_todo,
            toggle_todo,
            clear_completed,
            reorder_todos,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
