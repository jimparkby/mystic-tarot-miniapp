import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Moon, Sun, Star, Heart, Zap, Eye, Crown, Shield } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

// Initialize Telegram WebApp
const initTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    WebApp.ready();
    WebApp.expand(); // Expand to full height
    // Set Telegram theme
    if (WebApp.themeParams?.bg_color) {
      document.documentElement.style.setProperty(
        '--tg-theme-bg-color',
        WebApp.themeParams.bg_color
      );
    }
    return WebApp.initDataUnsafe?.user || null;
  }
  return null;
};

// Get API URL from environment or use default
const getApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl) return envUrl;
  // Fallback for local development
  return 'http://localhost:8000';
};

const API_URL = getApiUrl();

const cardIcons = [
  <Star className="w-8 h-8 md:w-12 md:h-12" />,
  <Zap className="w-8 h-8 md:w-12 md:h-12" />,
  <Eye className="w-8 h-8 md:w-12 md:h-12" />,
  <Crown className="w-8 h-8 md:w-12 md:h-12" />,
  <Shield className="w-8 h-8 md:w-12 md:h-12" />,
  <Heart className="w-8 h-8 md:w-12 md:h-12" />,
  <Moon className="w-8 h-8 md:w-12 md:h-12" />,
  <Sun className="w-8 h-8 md:w-12 md:h-12" />,
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
  const [telegramUser, setTelegramUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initialize Telegram WebApp
    const user = initTelegramWebApp();
    setTelegramUser(user);

    // Check if mobile
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Load spreads
    fetch(`${API_URL}/api/spreads`)
      .then(res => res.json())
      .then(data => setSpreads(data.spreads))
      .catch(err => {
        console.error('Failed to load spreads:', err);
        alert('Не удалось загрузить расклады. Проверьте подключение.');
      });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartReading = async () => {
    setIsLoading(true);
    setReading(null);
    setFlippedCards(new Set());
    setShowInterpretation(false);

    try {
      const requestBody = {
        question: question,
        spread_type: selectedSpread,
        language: 'ru',
        user_id: telegramUser?.id,
        username: telegramUser?.username
      };

      const response = await fetch(`${API_URL}/api/reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReading(data);

      // Card flip animation
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
      alert('Ошибка при создании гадания. Попробуйте снова.');
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

  // Mobile optimized layout
  const cardGridClass = isMobile
    ? 'grid grid-cols-2 gap-3'
    : 'flex flex-wrap justify-center gap-6';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden safe-area">
      <div className="relative z-10 container mx-auto px-4 py-6 pb-20">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ Luvo Tarot ✨
          </h1>
          <p className="text-base md:text-xl text-purple-200">Откройте тайны судьбы через древние карты</p>
          {telegramUser && (
            <p className="text-xs text-purple-300 mt-2">
              👤 {telegramUser.first_name || telegramUser.username || 'Пользователь'}
            </p>
          )}
        </header>

        {!reading ? (
          <div className="max-w-2xl md:max-w-3xl mx-auto px-2 md:px-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-400/30 shadow-2xl">
              <div className="mb-6">
                <label className="block text-purple-200 mb-2 md:mb-3 text-base md:text-lg">Задайте свой вопрос картам</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 md:p-4 bg-white/5 border border-purple-400/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all resize-none text-sm md:text-base"
                  rows={3}
                  placeholder="О чем вы хотите узнать? Что волнует вашу душу?"
                  maxLength={500}
                />
              </div>

              <div className="mb-6 md:mb-8">
                <label className="block text-purple-200 mb-2 md:mb-3 text-base md:text-lg">Выберите расклад</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {spreads.map(spread => (
                    <button
                      key={spread.id}
                      onClick={() => setSelectedSpread(spread.id)}
                      className={`p-3 md:p-4 rounded-xl border-2 transition-all transform active:scale-95 md:hover:scale-105 text-sm md:text-base ${
                        selectedSpread === spread.id
                          ? 'bg-purple-600/30 border-purple-400 shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 border-purple-400/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl md:text-3xl mb-1">{getRandomIcon()}</div>
                      <h3 className="font-semibold text-xs md:text-sm mb-1">{spread.name}</h3>
                      <p className="text-xs text-purple-200">{spread.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleStartReading}
                  disabled={!canStartReading || isLoading}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all transform ${
                    canStartReading && !isLoading
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 md:hover:scale-105 shadow-lg shadow-purple-500/50'
                      : 'bg-gray-600/50 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Тасую колоду...' : 'Начать гадание'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl md:max-w-6xl mx-auto px-2 md:px-0">
            <div className="mb-8 md:mb-12">
              <div className={cardGridClass}>
                {reading.cards.map((card, index) => (
                  <div key={index} className="perspective-1000">
                    <div className={`relative w-32 h-48 md:w-40 md:h-64 rounded-lg md:rounded-xl shadow-2xl transition-transform duration-1000 transform-style-preserve-3d ${flippedCards.has(index) ? 'rotate-y-180' : ''}`}>
                      <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-700 to-purple-800 rounded-lg md:rounded-xl border-2 border-purple-400/50 flex items-center justify-center">
                        {getRandomIcon()}
                      </div>
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-800 rounded-lg md:rounded-xl overflow-hidden">
                        <img
                          src={`${API_URL}/cards/${card.image}`}
                          alt={card.name_ru}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 w-full p-1 md:p-2 bg-black/60 text-center">
                          <h4 className="font-bold text-xs md:text-sm">{card.name_ru}</h4>
                          {card.reversed && <span className="text-xs text-red-300">Перевернутая</span>}
                          <p className="text-xs text-purple-200 hidden sm:block">{card.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showInterpretation && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-400/30 shadow-2xl animate-fade-in">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-300">🔮 Толкование расклада</h2>
                <div className="text-sm md:text-base text-purple-100 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {reading.interpretation}
                </div>
                <div className="text-center mt-6 md:mt-8">
                  <button
                    onClick={resetReading}
                    className="px-6 md:px-8 py-2 md:py-3 bg-purple-600/30 border-2 border-purple-400 rounded-full hover:bg-purple-600/50 transition-all transform active:scale-95 md:hover:scale-105 text-sm md:text-base"
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
        .safe-area {
          padding-top: max(20px, env(safe-area-inset-top));
          padding-bottom: max(20px, env(safe-area-inset-bottom));
          padding-left: max(12px, env(safe-area-inset-left));
          padding-right: max(12px, env(safe-area-inset-right));
        }
      `}</style>
    </div>
  );
}
