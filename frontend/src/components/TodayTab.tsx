import { useFeedStore } from "../store";
import { createTodo, createReminder } from "../services/api";
import { Plus, Clock } from "lucide-react";

type Actions = {
  morning?: string;
  noon?: string;
  afternoon?: string;
  night?: string;
};

type EnergyCard = {
  number?: string | number;
  title?: string;
  keywords?: string;
  quickTip?: string;
  challenges?: string;
  opportunities?: string;
  mistakesToAvoid?: string;
  actions: Actions;
  affirmation?: string;
  quote?: string;
};

export default function TodayTab() {
  const { todayFeed } = useFeedStore();

  if (!todayFeed) {
    return (
      <div className="text-center py-12 text-gray-500">
        Đang tải...
      </div>
    );
  }

  const { energyCard } = todayFeed as { energyCard: EnergyCard };

  const handleAddTodo = async (text: string, sourceTag: string) => {
    try {
      await createTodo({ text, sourceTag });
      alert("Đã thêm vào To-do!");
    } catch (error) {
      console.error("Add todo error:", error);
      alert("Không thể thêm To-do");
    }
  };

  const handleAddReminder = async (text: string, sourceTag: string) => {
    try {
      // ví dụ đặt nhắc sau 2 giờ kể từ bây giờ
      const remindAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      await createReminder({ text, sourceTag, remindAt });
      alert("Đã đặt nhắc!");
    } catch (error) {
      console.error("Add reminder error:", error);
      alert("Không thể đặt nhắc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Energy Card */}
      <div className="rounded-2xl border-2 border-[#e9c98a] bg-gradient-to-br from-[#f6e7d3] to-[#faefde] p-6">
        <div className="text-center mb-2">
          <div className="inline-block bg-white rounded-full px-6 py-2 mb-4 border border-[#ead8c6]">
            <span className="text-4xl font-bold text-[#c79a4b]">
              {energyCard?.number ?? "--"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {energyCard?.title ?? "Năng lượng hôm nay"}
          </h2>
          {energyCard?.keywords && (
            <p className="text-[#8a6a2d] font-medium">
              {energyCard.keywords}
            </p>
          )}
        </div>
      </div>

      {/* Quick Tip */}
      {energyCard?.quickTip && (
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Mẹo nhanh</h3>
          <p className="text-gray-700">{energyCard.quickTip}</p>
        </div>
      )}

      {/* Challenges & Opportunities */}
      <div className="grid md:grid-cols-2 gap-4">
        {energyCard?.challenges && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">⚠️ Thách thức</h3>
            <p className="text-gray-700">{energyCard.challenges}</p>
          </div>
        )}
        {energyCard?.opportunities && (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">🌟 Cơ hội</h3>
            <p className="text-gray-700">{energyCard.opportunities}</p>
          </div>
        )}
      </div>

      {/* Mistakes to Avoid */}
      {energyCard?.mistakesToAvoid && (
        <div className="rounded-2xl bg-orange-50 border border-orange-300 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">🚫 Hướng dẫn tránh sai lầm</h3>
          <p className="text-gray-700">{energyCard.mistakesToAvoid}</p>
        </div>
      )}

      {/* Actions */}
      <div className="rounded-2xl border border-[#ead8c6] bg-white p-5">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Hành động gợi ý</h3>
        <div className="space-y-4">
          {energyCard?.actions?.morning && (
            <ActionItem
              time="Sáng"
              icon="🌅"
              text={energyCard.actions.morning}
              onAddTodo={() => handleAddTodo(energyCard.actions.morning!, "morning_action")}
              onAddReminder={() => handleAddReminder(energyCard.actions.morning!, "morning_action")}
            />
          )}
          {energyCard?.actions?.noon && (
            <ActionItem
              time="Trưa"
              icon="☀️"
              text={energyCard.actions.noon}
              onAddTodo={() => handleAddTodo(energyCard.actions.noon!, "noon_action")}
              onAddReminder={() => handleAddReminder(energyCard.actions.noon!, "noon_action")}
            />
          )}
          {energyCard?.actions?.afternoon && (
            <ActionItem
              time="Chiều"
              icon="🌤️"
              text={energyCard.actions.afternoon}
              onAddTodo={() => handleAddTodo(energyCard.actions.afternoon!, "afternoon_action")}
              onAddReminder={() => handleAddReminder(energyCard.actions.afternoon!, "afternoon_action")}
            />
          )}
          {energyCard?.actions?.night && (
            <ActionItem
              time="Tối"
              icon="🌙"
              text={energyCard.actions.night}
              onAddTodo={() => handleAddTodo(energyCard.actions.night!, "night_action")}
              onAddReminder={() => handleAddReminder(energyCard.actions.night!, "night_action")}
            />
          )}
        </div>
      </div>

      {/* Affirmation & Quote */}
      {(energyCard?.affirmation || energyCard?.quote) && (
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-pink-100 text-center p-6">
          {energyCard?.affirmation && (
            <p className="text-lg font-medium text-gray-900 mb-2">
              “{energyCard.affirmation}”
            </p>
          )}
          {energyCard?.quote && (
            <p className="text-sm text-gray-600 italic">{energyCard.quote}</p>
          )}
        </div>
      )}
    </div>
  );
}

type ActionItemProps = {
  time: string;
  icon: string;
  text?: string;
  onAddTodo: () => void;
  onAddReminder: () => void;
};

function ActionItem({ time, icon, text, onAddTodo, onAddReminder }: ActionItemProps) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
      <span className="text-2xl leading-none">{icon}</span>
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-600 mb-1">{time}</div>
        <p className="text-gray-900">{text}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAddTodo}
          className="inline-flex items-center gap-1 rounded-lg bg-[#c79a4b] text-white text-sm px-3 py-1.5 shadow hover:brightness-105 active:translate-y-px transition"
          title="Thêm vào To-do"
          aria-label="Thêm vào To-do"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={onAddReminder}
          className="inline-flex items-center gap-1 rounded-lg border border-[#d9c7b5] bg-white text-[#6e645b] text-sm px-3 py-1.5 hover:bg-[#fff1e2] transition"
          title="Đặt nhắc"
          aria-label="Đặt nhắc"
        >
          <Clock size={16} />
        </button>
      </div>
    </div>
  );
}
