
import { useFeedStore } from "../store";

interface PeriodTabProps {
  scope: "week" | "month" | "year";
}

export default function PeriodTab({ scope }: PeriodTabProps) {
  const { periodFeed } = useFeedStore();

  // chưa có dữ liệu hoặc khác scope đang yêu cầu
  if (!periodFeed || periodFeed.scope !== scope) {
    return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  }

  const energyCard = periodFeed.energyCard ?? {};
  const title = scope === "week" ? "Tuần này" : scope === "month" ? "Tháng này" : "Năm này";

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="inline-block bg-white rounded-full px-6 py-2 mb-4 border border-emerald-100">
            <span className="text-4xl font-bold text-emerald-600">
              {energyCard.number ?? "--"}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {energyCard.title ?? "Năng lượng giai đoạn"}
          </h3>
          {energyCard.keywords && (
            <p className="text-emerald-700 font-medium">{energyCard.keywords}</p>
          )}
        </div>
      </div>

      {/* Quick tip */}
      {energyCard.quickTip && (
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Lời khuyên</h3>
          <p className="text-gray-700">{energyCard.quickTip}</p>
        </div>
      )}

      {/* Challenges & Opportunities */}
      <div className="grid md:grid-cols-2 gap-4">
        {energyCard.challenges && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">⚠️ Thách thức</h3>
            <p className="text-gray-700">{energyCard.challenges}</p>
          </div>
        )}
        {energyCard.opportunities && (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">🌟 Cơ hội</h3>
            <p className="text-gray-700">{energyCard.opportunities}</p>
          </div>
        )}
      </div>

      {/* Mistakes to avoid */}
      {energyCard.mistakesToAvoid && (
        <div className="rounded-2xl bg-orange-50 border border-orange-300 p-5">
          <h3 className="font-semibold text-gray-900 mb-2">🚫 Điều cần tránh</h3>
          <p className="text-gray-700">{energyCard.mistakesToAvoid}</p>
        </div>
      )}

      {/* Affirmation / Quote */}
      {(energyCard.affirmation || energyCard.quote) && (
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-pink-100 text-center p-6">
          {energyCard.affirmation && (
            <p className="text-lg font-medium text-gray-900">“{energyCard.affirmation}”</p>
          )}
          {energyCard.quote && (
            <p className="text-sm text-gray-600 italic mt-2">{energyCard.quote}</p>
          )}
        </div>
      )}
    </div>
  );
}