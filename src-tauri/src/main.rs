// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use todo_app_lib::*;

fn main() {
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
