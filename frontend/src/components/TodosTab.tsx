import React, { useState } from 'react';
import { useTodoStore } from '../store';
import { createTodo, updateTodo, deleteTodo, createReminder } from '../services/api';
import { Plus, Trash2, Check, Clock } from 'lucide-react';

export default function TodosTab() {
  const { todos, addTodo, updateTodo: updateTodoStore, removeTodo } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    setLoading(true);
    try {
      const response = await createTodo({ text: newTodoText });
      addTodo(response.data);
      setNewTodoText('');
    } catch (error) {
      console.error('Add todo error:', error);
      alert('KhÃ´ng thá»ƒ thÃªm To-do');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDone = async (id: string, doneAt: string | null) => {
    try {
      const newDoneAt = doneAt ? null : new Date().toISOString();
      await updateTodo(id, { doneAt: newDoneAt });
      updateTodoStore(id, { doneAt: newDoneAt });
    } catch (error) {
      console.error('Toggle todo error:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a To-do nÃ y?')) return;

    try {
      await deleteTodo(id);
      removeTodo(id);
    } catch (error) {
      console.error('Delete todo error:', error);
      alert('KhÃ´ng thá»ƒ xÃ³a To-do');
    }
  };

  const handleSetReminder = async (todoId: string, time: string) => {
    try {
      const today = new Date();
      const [hours, minutes] = time.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      await createReminder({
        todoId,
        remindAt: today.toISOString(),
      });
      
      alert(`ÄÃ£ Ä‘áº·t nháº¯c nhá»Ÿ lÃºc ${time}`);
    } catch (error) {
      console.error('Set reminder error:', error);
      alert('KhÃ´ng thá»ƒ Ä‘áº·t nháº¯c nhá»Ÿ');
    }
  };

  const activeTodos = todos.filter(t => !t.doneAt);
  const completedTodos = todos.filter(t => t.doneAt);

  return (
    <div className="space-y-6">
      {/* Add Todo Form */}
      <div className="card">
        <form onSubmit={handleAddTodo} className="flex gap-3">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="input flex-1"
            placeholder="ThÃªm cÃ´ng viá»‡c má»›i..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newTodoText.trim()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            ThÃªm
          </button>
        </form>
      </div>

      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">ðŸ“ CÃ´ng viá»‡c cáº§n lÃ m</h3>
          <div className="space-y-3">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
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
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-gray-600 mb-4">âœ… ÄÃ£ hoÃ n thÃ nh</h3>
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleDone={handleToggleDone}
                onDelete={handleDeleteTodo}
                onSetReminder={handleSetReminder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">ChÆ°a cÃ³ cÃ´ng viá»‡c nÃ o</p>
          <p className="text-sm text-gray-400">
            ThÃªm cÃ´ng viá»‡c tá»« gá»£i Ã½ trong tab "HÃ´m nay" hoáº·c táº¡o má»›i á»Ÿ trÃªn
          </p>
        </div>
      )}
    </div>
  );
}

function TodoItem({ todo, onToggleDone, onDelete, onSetReminder }: any) {
  const [showReminderOptions, setShowReminderOptions] = useState(false);

  const reminderTimes = ['10:00', '14:00', '20:00'];

  return (
    <div className={`flex items-start gap-3 p-3 bg-white rounded-xl border ${
      todo.doneAt ? 'border-gray-200 opacity-60' : 'border-gray-300'
    }`}>
      <button
        onClick={() => onToggleDone(todo.id, todo.doneAt)}
        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          todo.doneAt
            ? 'bg-green-500 border-green-500'
            : 'border-gray-400 hover:border-primary-500'
        }`}
      >
        {todo.doneAt && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`${todo.doneAt ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {todo.text}
        </p>
        {todo.sourceTag && (
          <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {todo.sourceTag.replace('_', ' ')}
          </span>
        )}
      </div>

      {!todo.doneAt && (
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowReminderOptions(!showReminderOptions)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Äáº·t nháº¯c nhá»Ÿ"
            >
              <Clock size={18} />
            </button>
            
            {showReminderOptions && (
              <div className="absolute right-0 mt-1 bg-white border rounded-xl shadow-lg p-2 z-10 whitespace-nowrap">
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
          </div>

          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="XÃ³a"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
