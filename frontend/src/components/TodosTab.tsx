import React, { useMemo, useState } from "react";
import { useTodoStore } from "../store";
import { createTodo, updateTodo, deleteTodo, createReminder } from "../services/api";
import { Plus, Trash2, Check, Clock } from "lucide-react";

// Dùng kiểu UI cục bộ để tránh xung đột với kiểu Todo nơi khác
type UITodo = {
  id: string;
  text: string;
  doneAt?: string | null;      // cho phép undefined hoặc null
  sourceTag?: string | null;
};

export default function TodosTab() {
  const { todos, addTodo, updateTodo: updateTodoStore, removeTodo } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Chuẩn hóa: mọi todo đều có doneAt: string | null
  const normalizedTodos: UITodo[] = useMemo(
    () => (todos as UITodo[]).map((t) => ({ ...t, doneAt: t.doneAt ?? null })),
    [todos]
  );

  const makeLocalISO = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newTodoText.trim();
    if (!text) return;
    setLoading(true);
    try {
      const res = await createTodo({ text });
      // đảm bảo chuẩn hóa khi add vào store
      const added: UITodo = { ...(res.data as any), doneAt: (res.data as any)?.doneAt ?? null };
      addTodo(added);
      setNewTodoText("");
    } catch (error) {
      console.error("Add todo error:", error);
      alert("Không thể thêm To-do");
    } finally {
      setLoading(false);
    }
  };

  // nhận cả undefined cho an toàn
  const handleToggleDone = async (id: string, doneAt: string | null | undefined) => {
    const newDoneAt: string | null = doneAt ? null : new Date().toISOString();
    try {
      setPendingId(id);
      updateTodoStore(id, { doneAt: newDoneAt });
      await updateTodo(id, { doneAt: newDoneAt });
    } catch (error) {
      console.error("Toggle todo error:", error);
      updateTodoStore(id, { doneAt: doneAt ?? null }); // rollback
    } finally {
      setPendingId((x) => (x === id ? null : x));
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá To-do này?")) return;
    try {
      setPendingId(id);
      await deleteTodo(id);
      removeTodo(id);
    } catch (error) {
      console.error("Delete todo error:", error);
      alert("Không thể xoá To-do");
    } finally {
      setPendingId((x) => (x === id ? null : x));
    }
  };

  const handleSetReminder = async (todoId: string, time: string) => {
    try {
      setPendingId(todoId);
      const now = new Date();
      const [h, m] = time.split(":").map((v) => parseInt(v, 10));
      const remindAt = new Date(now);
      remindAt.setHours(h, m, 0, 0);
      if (remindAt.getTime() <= now.getTime()) {
        remindAt.setDate(remindAt.getDate() + 1);
      }
      await createReminder({ todoId, remindAt: makeLocalISO(remindAt) });
      alert(`Đã đặt nhắc lúc ${time}`);
    } catch (error) {
      console.error("Set reminder error:", error);
      alert("Không thể đặt nhắc");
    } finally {
      setPendingId((x) => (x === todoId ? null : x));
    }
  };

  const activeTodos = normalizedTodos.filter((t) => !t.doneAt);
  const completedTodos = normalizedTodos.filter((t) => !!t.doneAt);

  return (
    <div className="space-y-6">
      {/* Add Todo */}
      <div className="rounded-2xl border border-[#ead8c6] bg-white p-4">
        <form onSubmit={handleAddTodo} className="flex gap-3">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="h-11 flex-1 rounded-xl border-2 border-[#e9c98a] bg-white px-4 text-[15px] placeholder:text-[#b9a38f] outline-none focus:border-[#c79a4b] focus:ring-4 focus:ring-[rgba(199,154,75,.18)]"
            placeholder="Thêm công việc mới..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newTodoText.trim()}
            className="inline-flex items-center gap-2 h-11 rounded-xl bg-[#c79a4b] text-white px-4 font-medium shadow hover:brightness-105 active:translate-y-px transition disabled:opacity-60"
            aria-label="Thêm To-do"
            title="Thêm To-do"
          >
            <Plus size={20} />
            Thêm
          </button>
        </form>
      </div>

      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div className="rounded-2xl border border-[#ead8c6] bg-white p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Công việc cần làm</h3>
          <div className="space-y-3">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                pending={pendingId === todo.id}
                onToggleDone={handleToggleDone}
                onDelete={handleDeleteTodo}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="rounded-2xl border border-[#ead8c6] bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-600 mb-4">Đã hoàn thành</h3>
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                pending={pendingId === todo.id}
                onToggleDone={handleToggleDone}
                onDelete={handleDeleteTodo}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {normalizedTodos.length === 0 && (
        <div className="rounded-2xl border border-[#ead8c6] bg-white p-6 text-center">
          <p className="text-gray-500 mb-2">Chưa có công việc nào</p>
          <p className="text-sm text-gray-400">
            Thêm công việc từ gợi ý trong tab “Hôm nay” hoặc tạo mới ở trên.
          </p>
        </div>
      )}
    </div>
  );
}

function TodoItem({
  todo,
  pending,
  onToggleDone,
  onDelete,
  onSetReminder,
}: {
  todo: UITodo;
  pending: boolean;
  onToggleDone: (id: string, doneAt: string | null | undefined) => void; // nhận cả undefined
  onDelete: (id: string) => void;
  onSetReminder: (todoId: string, time: string) => void;
}) {
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const reminderTimes = ["10:00", "14:00", "20:00"];

  return (
    <div
      className={`flex items-start gap-3 p-3 bg-white rounded-xl border ${
        todo.doneAt ? "border-gray-200 opacity-60" : "border-gray-300"
      }`}
    >
      <button
        onClick={() => onToggleDone(todo.id, todo.doneAt)}
        disabled={pending}
        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          todo.doneAt
            ? "bg-green-500 border-green-500"
            : "border-gray-400 hover:border-[#c79a4b]"
        } disabled:opacity-60`}
        aria-label={todo.doneAt ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành"}
        title={todo.doneAt ? "Bỏ hoàn thành" : "Đánh dấu hoàn thành"}
      >
        {todo.doneAt && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={todo.doneAt ? "line-through text-gray-500" : "text-gray-900"}>
          {todo.text}
        </p>
        {todo.sourceTag && (
          <span className="inline-block mt-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {todo.sourceTag.replace("_", " ")}
          </span>
        )}
      </div>

      {!todo.doneAt && (
        <div className="flex gap-2 relative">
          <button
            onClick={() => setShowReminderOptions((v) => !v)}
            disabled={pending}
            className="p-2 text-gray-500 hover:text-[#c79a4b] hover:bg-[#fff1e2] rounded-lg transition-colors disabled:opacity-60"
            title="Đặt nhắc"
            aria-label="Đặt nhắc"
          >
            <Clock size={18} />
          </button>

          {showReminderOptions && (
            <div className="absolute right-0 top-9 bg-white border rounded-xl shadow-lg p-2 z-10 whitespace-nowrap">
              {reminderTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    onSetReminder(todo.id, time);
                    setShowReminderOptions(false);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                >
                  {time}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => onDelete(todo.id)}
            disabled={pending}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60"
            title="Xoá"
            aria-label="Xoá"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
