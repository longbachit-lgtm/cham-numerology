import React from 'react';
import { useFeedStore } from '../store';

interface PeriodTabProps {
  scope: 'week' | 'month' | 'year';
}

export default function PeriodTab({ scope }: PeriodTabProps) {
  const { periodFeed } = useFeedStore();

  if (!periodFeed || periodFeed.scope !== scope) {
    return <div className="text-center py-12 text-gray-500">Äang táº£i...</div>;
  }

  const { energyCard } = periodFeed;
  const title = scope === 'week' ? 'Tuáº§n nÃ y' : scope === 'month' ? 'ThÃ¡ng nÃ y' : 'NÄƒm nÃ y';

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="inline-block bg-white rounded-full px-6 py-2 mb-4">
            <span className="text-4xl font-bold text-emerald-600">{energyCard.number}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{energyCard.title}</h3>
          <p className="text-emerald-700 font-medium">{energyCard.keywords}</p>
        </div>
      </div>

      {energyCard.quickTip && (
        <div className="card bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="font-semibold text-gray-900 mb-2">ðŸ’¡ Lá»i khuyÃªn</h3>
          <p className="text-gray-700">{energyCard.quickTip}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {energyCard.challenges && (
          <div className="card bg-red-50">
            <h3 className="font-semibold text-gray-900 mb-2">âš ï¸ ThÃ¡ch thá»©c</h3>
            <p className="text-gray-700">{energyCard.challenges}</p>
          </div>
        )}
        {energyCard.opportunities && (
          <div className="card bg-green-50">
            <h3 className="font-semibold text-gray-900 mb-2">ðŸŒŸ CÆ¡ há»™i</h3>
            <p className="text-gray-700">{energyCard.opportunities}</p>
          </div>
        )}
      </div>

      {energyCard.mistakesToAvoid && (
        <div className="card bg-orange-50">
          <h3 className="font-semibold text-gray-900 mb-2">ðŸš« Äiá»u cáº§n trÃ¡nh</h3>
          <p className="text-gray-700">{energyCard.mistakesToAvoid}</p>
        </div>
      )}

      {energyCard.affirmation && (
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 text-center">
          <p className="text-lg font-medium text-gray-900">"{energyCard.affirmation}"</p>
          {energyCard.quote && (
            <p className="text-sm text-gray-600 italic mt-2">{energyCard.quote}</p>
          )}
        </div>
      )}
    </div>
  );
}
