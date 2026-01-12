package main

import (
    "encoding/json"
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
    "path/filepath"
    "strings"
    "sync"
)

type Task struct {
    ID          string  `json:"id"`
    Title       string  `json:"title"`
    Description *string `json:"description,omitempty"`
    DueDate     *int64  `json:"dueDate,omitempty"`
    Completed   bool    `json:"completed"`
    CreatedAt   int64   `json:"createdAt"`
}

type ActionRequest struct {
    Action string `json:"action"`
    Task   Task   `json:"task,omitempty"`
    ID     string `json:"id,omitempty"`
}

var (
    tasks    []Task
    tasksMu  sync.RWMutex
    dataFile string
)

func main() {
    // Determine data file path
    workDir, _ := os.Getwd()
    dataFile = filepath.Join(workDir, "data", "tasks.json")

    // Ensure data directory exists
    os.MkdirAll(filepath.Dir(dataFile), 0755)

    // Load initial data
    loadTasks()

    // API Routes
    http.HandleFunc("/api/tasks", handleTasks)

    // Static File Server (SPA)
    fs := http.FileServer(http.Dir("./dist"))
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        // If file exists (e.g. assets/index.css), serve it
        path := "./dist" + r.URL.Path
        if _, err := os.Stat(path); err == nil && r.URL.Path != "/" {
            fs.ServeHTTP(w, r)
            return
        }
        // Otherwise serve index.html (SPA routing)
        http.ServeFile(w, r, "./dist/index.html")
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("🐹 Go Server running on port %s", port)
    log.Fatal(http.ListenAndServe(":"+port, nil))
}

func loadTasks() {
    file, err := os.Open(dataFile)
    if err != nil {
        log.Println("ℹ️ No tasks.json found, starting empty.")
        tasks = []Task{}
        return
    }
    defer file.Close()

    if err := json.NewDecoder(file).Decode(&tasks); err != nil {
        log.Println("⚠️ Error decoding tasks.json:", err)
        tasks = []Task{}
    }
    log.Printf("✅ Loaded %d tasks from disk", len(tasks))
}

func saveTasks() {
    tasksMu.RLock()
    defer tasksMu.RUnlock()

    data, _ := json.MarshalIndent(tasks, "", "  ")
    if err := os.WriteFile(dataFile, data, 0644); err != nil {
        log.Println("❌ Failed to save tasks:", err)
    }
}

func handleTasks(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    if r.Method == "GET" {
        tasksMu.RLock()
        json.NewEncoder(w).Encode(tasks)
        tasksMu.RUnlock()
        return
    }

    if r.Method == "POST" {
        var req ActionRequest
        body, _ := io.ReadAll(r.Body)
        if err := json.Unmarshal(body, &req); err != nil {
            http.Error(w, "Invalid JSON", http.StatusBadRequest)
            return
        }

        tasksMu.Lock()
        defer tasksMu.Unlock()

        switch req.Action {
        case "add":
            // Prepend task
            tasks = append([]Task{req.Task}, tasks...)
        case "toggle":
            for i := range tasks {
                if tasks[i].ID == req.ID {
                    tasks[i].Completed = !tasks[i].Completed
                    break
                }
            }
        case "remove":
            newTasks := []Task{}
            for _, t := range tasks {
                if t.ID != req.ID {
                    newTasks = append(newTasks, t)
                }
            }
            tasks = newTasks
        }

        // Save to disk asynchronously
        go saveTasks()

        json.NewEncoder(w).Encode(tasks)
    }
}
