// frontend/app/tasks/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Category { id: number; name: string; color: string; icon: string; }
interface User { id: number; username: string; email?: string; fullName?: string; }
interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: string;
  dueDate?: string;
  userId?: number;
  categoryId?: number;
  user?: User;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

type FetchOptions = RequestInit | undefined;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug helpers to show qué url falló
  const [lastAttemptedUrl, setLastAttemptedUrl] = useState<string | null>(null);
  const [lastAttemptError, setLastAttemptError] = useState<string | null>(null);

  // Nuevo task (controlado)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    userId: 0,
    categoryId: 0,
  });

  // Base pública (usar NEXT_PUBLIC_API_URL en .env.local)
  const rawBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const base = rawBase.replace(/\/$/, ""); // quitar slash final si existe
  // Probar con /api primero y sin /api después (fallback)
  const apiBases = [`${base}/api`, base];

  // Helper: construye url desde base + path
  const buildUrl = (baseUrl: string, path: string) =>
    baseUrl.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);

  // Helper: intenta en las bases hasta encontrar una respuesta ok.
  const fetchWithFallback = async (path: string, options?: FetchOptions) => {
    let lastErr: any = null;
    for (const b of apiBases) {
      const url = buildUrl(b, path);
      setLastAttemptedUrl(url);
      try {
        const res = await fetch(url, options);
        if (res.ok) return res; // éxito
        // Si el servidor responde (404, 500, etc) nos guardamos el text para debugging
        const text = await res.text().catch(() => "<no body>");
        lastErr = `HTTP ${res.status} ${res.statusText} - ${text}`;
      } catch (e: any) {
        lastErr = e?.message ?? String(e);
      }
    }
    setLastAttemptError(String(lastErr));
    throw new Error(String(lastErr));
  };

  // Cargar tasks / categories / users (Promise.all con fallback)
  const loadAll = async () => {
    setLoading(true);
    setError(null);
    setLastAttemptError(null);
    setLastAttemptedUrl(null);

    try {
      const [tasksRes, catsRes, usersRes] = await Promise.all([
        fetchWithFallback("/tasks"),
        fetchWithFallback("/categories"),
        fetchWithFallback("/users"),
      ]);

      // parsear JSON (si falla, mostrar el body como texto)
      const parseJsonSafe = async (res: Response) => {
        try {
          return await res.json();
        } catch {
          const text = await res.text().catch(() => "<no body>");
          throw new Error(`Invalid JSON from ${res.url}: ${text}`);
        }
      };

      const [tasksData, catsData, usersData] = await Promise.all([
        parseJsonSafe(tasksRes),
        parseJsonSafe(catsRes),
        parseJsonSafe(usersRes),
      ]);

      setTasks(tasksData ?? []);
      setCategories(catsData ?? []);
      setUsers(usersData ?? []);

      // Si no hay userId/categoryId en newTask, asignar primeros ids disponibles para evitar selects vacíos con value no existente
      setNewTask((prev) => ({
        ...prev,
        userId: prev.userId || (Array.isArray(usersData) && usersData[0]?.id) || 0,
        categoryId: prev.categoryId || (Array.isArray(catsData) && catsData[0]?.id) || 0,
      }));
    } catch (err: any) {
      console.error("loadAll error:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Asegurar que si users/categories cambian y newTask tiene ids inválidos se actualicen
  useEffect(() => {
    if (users.length && !users.find((u) => u.id === newTask.userId)) {
      setNewTask((n) => ({ ...n, userId: users[0].id }));
    }
    if (categories.length && !categories.find((c) => c.id === newTask.categoryId)) {
      setNewTask((n) => ({ ...n, categoryId: categories[0].id }));
    }
  }, [users, categories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers: POST, PATCH(toggle), DELETE, todos usando fetchWithFallback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetchWithFallback("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "<no body>");
        throw new Error(`Create task failed ${res.status}: ${text}`);
      }

      // Recargar
      await loadAll();

      // limpiar formulario
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        userId: users[0]?.id ?? 0,
        categoryId: categories[0]?.id ?? 0,
      });
    } catch (err: any) {
      console.error("handleSubmit error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const toggleTask = async (taskId: number) => {
    setError(null);
    try {
      const res = await fetchWithFallback(`/tasks/${taskId}/toggle`, { method: "PATCH" });
      if (!res.ok) {
        const text = await res.text().catch(() => "<no body>");
        throw new Error(`Toggle failed ${res.status}: ${text}`);
      }
      await loadAll();
    } catch (err: any) {
      console.error("toggleTask error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return;
    setError(null);
    try {
      const res = await fetchWithFallback(`/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "<no body>");
        throw new Error(`Delete failed ${res.status}: ${text}`);
      }
      await loadAll();
    } catch (err: any) {
      console.error("deleteTask error:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">📝 Gestión de Tareas</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Debug información de los intentos */}
        {(lastAttemptedUrl || lastAttemptError) && (
          <div className="mb-4 text-sm text-gray-600">
            <div>Último intento: <code>{lastAttemptedUrl}</code></div>
            {lastAttemptError && <div className="text-red-500">Error: {lastAttemptError}</div>}
          </div>
        )}

        {/* Formulario Nueva Tarea */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Nueva Tarea</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                  placeholder="Título de la tarea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prioridad</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Usuario</label>
                <select
                  value={newTask.userId}
                  onChange={(e) => setNewTask({ ...newTask, userId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                >
                  {users.length ? (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))
                  ) : (
                    <option value={0}>— sin usuarios —</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  value={newTask.categoryId}
                  onChange={(e) => setNewTask({ ...newTask, categoryId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                >
                  {categories.length ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value={0}>— sin categorías —</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                rows={3}
                placeholder="Descripción opcional"
              />
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              ➕ Crear Tarea
            </button>
          </form>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-3xl font-bold">{tasks.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Tareas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{tasks.filter((t) => t.completed).length}</div>
            <div className="text-gray-600 dark:text-gray-400">Completadas</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">{tasks.filter((t) => !t.completed).length}</div>
            <div className="text-gray-600 dark:text-gray-400">Pendientes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">{tasks.filter((t) => t.priority === "high" && !t.completed).length}</div>
            <div className="text-gray-600 dark:text-gray-400">Alta Prioridad</div>
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Lista de Tareas</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay tareas. ¡Crea tu primera tarea!</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 ${task.completed ? "bg-gray-50 dark:bg-gray-700 opacity-75" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5 cursor-pointer"
                      />
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</h3>
                        {task.description && <p className="text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>}
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                          {task.category && (
                            <span
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ backgroundColor: task.category.color + "20", color: task.category.color }}
                            >
                              {task.category.icon} {task.category.name}
                            </span>
                          )}
                          {task.user && <span className="text-gray-500">👤 {task.user.username}</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700 ml-4" title="Eliminar tarea">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
