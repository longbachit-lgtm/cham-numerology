import React from 'react';
import { useFeedStore } from '../store';

export default function TomorrowTab() {
  const { tomorrowFeed } = useFeedStore();

  if (!tomorrowFeed) {
    return <div className="text-center py-12 text-gray-500">Äang táº£i...</div>;
  }

  const { energyCard } = tomorrowFeed;

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block bg-white rounded-full px-6 py-2 mb-4">
            <span className="text-4xl font-bold text-indigo-600">{energyCard.number}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{energyCard.title}</h2>
          <p className="text-indigo-700 font-medium">{energyCard.keywords}</p>
        </div>
      </div>

      {energyCard.quickTip && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Mẹo cho ngày mai</h3>
          <p className="text-gray-700">{energyCard.quickTip}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {energyCard.challenges && (
          <div className="card bg-red-50">
            <h3 className="font-semibold text-gray-900 mb-2">⚠️ Thách thức</h3>
            <p className="text-gray-700">{energyCard.challenges}</p>
          </div>
        )}
        {energyCard.opportunities && (
          <div className="card bg-green-50">
            <h3 className="font-semibold text-gray-900 mb-2">🌟 Cơ hội</h3>
            <p className="text-gray-700">{energyCard.opportunities}</p>
          </div>
        )}
      </div>

      {energyCard.affirmation && (
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 text-center">
          <p className="text-lg font-medium text-gray-900">"{energyCard.affirmation}"</p>
        </div>
      )}
    </div>
  );
}
