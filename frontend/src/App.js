import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Moon, Sun, Star, Heart, Zap, Eye, Crown, Shield } from 'lucide-react';
import axios from 'axios';
import { BASE_API_URL } from './apiConfig'; 



const createReading = async (question, spreadType) => {
    // ...
    try {
        // Замена старого URL на BASE_API_URL
        const response = await axios.post(`${BASE_API_URL}/api/reading`, {
            question,
            spread_type: spreadType,
            //init_data: initData, // Оставьте, если нужно для авторизации
            language: 'ru'
        });
        // ...
    } catch (error) {
        // ...
    }
};

const cardIcons = [
  <Star className="w-12 h-12" />, <Zap className="w-12 h-12" />, <Eye className="w-12 h-12" />,
  <Crown className="w-12 h-12" />, <Shield className="w-12 h-12" />, <Heart className="w-12 h-12" />,
  <Moon className="w-12 h-12" />, <Sun className="w-12 h-12" />,
];

const getRandomIcon = () => cardIcons[Math.floor(Math.random() * cardIcons.length)];

export default function TarotApp() {
  const [question, setQuestion] = useState('');
  const [spreads, setSpreads] = useState([]);
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reading, setReading] = useState(null);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/spreads`)
      .then(res => res.json())
      .then(data => setSpreads(data.spreads))
      .catch(console.error);

    const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 3 + 1, duration: Math.random() * 20 + 20
    }));
    setParticles(newParticles);
  }, []);

  const handleStartReading = async () => {
    setIsLoading(true);
    setReading(null);
    setFlippedCards(new Set());
    setShowInterpretation(false);

    try {
      const response = await fetch(`${BASE_API_URL}/api/reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question, spread_type: selectedSpread }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setReading(data);

      setTimeout(() => {
        data.cards.forEach((_, index) => {
          setTimeout(() => {
            setFlippedCards(prev => new Set(prev).add(index));
          }, index * 300);
        });

        setTimeout(() => {
          setShowInterpretation(true);
        }, data.cards.length * 300 + 500);
      }, 500);

    } catch (error) {
      console.error("Failed to fetch reading:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetReading = () => {
    setQuestion('');
    setSelectedSpread(null);
    setReading(null);
    setFlippedCards(new Set());
    setShowInterpretation(false);
  };

  const canStartReading = question.trim() && selectedSpread;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-purple-400 opacity-20"
          style={{
            left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out infinite`
          }}
        />
      ))}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ Mystic Tarot ✨
          </h1>
          <p className="text-xl text-purple-200">Откройте тайны судьбы через древние карты</p>
        </header>

        {!reading ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-purple-400/30 shadow-2xl">
              <div className="mb-6">
                <label className="block text-purple-200 mb-3 text-lg">Задайте свой вопрос картам</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-4 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all resize-none"
                  rows={3}
                  placeholder="О чем вы хотите узнать? Что волнует вашу душу?"
                />
              </div>

              <div className="mb-8">
                <label className="block text-purple-200 mb-3 text-lg">Выберите расклад</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {spreads.map(spread => (
                    <button
                      key={spread.id}
                      onClick={() => setSelectedSpread(spread.id)}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        selectedSpread === spread.id
                          ? 'bg-purple-600/30 border-purple-400 shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 border-purple-400/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-3xl mb-2">{getRandomIcon()}</div>
                      <h3 className="font-semibold mb-1">{spread.name}</h3>
                      <p className="text-sm text-purple-200">{spread.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleStartReading}
                  disabled={!canStartReading || isLoading}
                  className={`px-8 py-4 rounded-full font-semibold text-lg transition-all transform ${
                    canStartReading && !isLoading
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg shadow-purple-500/50'
                      : 'bg-gray-600/50 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Тасую колоду...' : 'Начать гадание'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
             <div className="mb-12">
                <div className="flex flex-wrap justify-center gap-6">
                    {reading.cards.map((card, index) => (
                        <div key={index} className="perspective-1000">
                            <div className={`relative w-40 h-64 rounded-xl shadow-2xl transition-transform duration-1000 transform-style-preserve-3d ${flippedCards.has(index) ? 'rotate-y-180' : ''}`}>
                                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl border-2 border-purple-400/50 flex items-center justify-center">
                                    {getRandomIcon()}
                                </div>
                                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-800 rounded-xl overflow-hidden">
                                    <img src={`${BASE_API_URL}/cards/${card.image}`} alt={card.name_ru} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 w-full p-2 bg-black/60 text-center">
                                        <h4 className="font-bold text-sm">{card.name_ru}</h4>
                                        {card.reversed && <span className="text-xs text-red-300">Перевернутая</span>}
                                        <p className="text-xs text-purple-200">{card.position}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {showInterpretation && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-purple-400/30 shadow-2xl animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-purple-300">🔮 Толкование расклада</h2>
                <div className="text-purple-100 whitespace-pre-wrap leading-relaxed">
                  {reading.interpretation}
                </div>
                <div className="text-center mt-8">
                  <button
                    onClick={resetReading}
                    className="px-6 py-3 bg-purple-600/30 border-2 border-purple-400 rounded-full hover:bg-purple-600/50 transition-all transform hover:scale-105"
                  >
                    Задать новый вопрос
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}