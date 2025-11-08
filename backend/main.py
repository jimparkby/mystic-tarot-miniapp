from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <- ОДИН РАЗ тут
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
# ... другие импорты ...

app = FastAPI(title="Mystic Tarot API")  # <- ПЕРЕНОС СТРОКИ!

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/cards", StaticFiles(directory="cards"), name="cards")
# ... остальной код ...

MAJOR_ARCANA = [
    {"id": 0, "name": "The Fool", "name_ru": "Шут", "meaning": "новые начинания, спонтанность, невинность",
     "keywords": ["начало", "потенциал", "риск"], "image": "m00.jpg"},
    {"id": 1, "name": "The Magician", "name_ru": "Маг", "meaning": "проявление, находчивость, сила воли",
     "keywords": ["воля", "мастерство", "действие"], "image": "m01.jpg"},
    {"id": 2, "name": "The High Priestess", "name_ru": "Верховная Жрица", "meaning": "интуиция, тайны, подсознание",
     "keywords": ["интуиция", "мудрость", "тайна"], "image": "m02.jpg"},
    {"id": 3, "name": "The Empress", "name_ru": "Императрица", "meaning": "плодородие, женственность, изобилие",
     "keywords": ["творчество", "природа", "изобилие"], "image": "m03.jpg"},
    {"id": 4, "name": "The Emperor", "name_ru": "Император", "meaning": "власть, структура, контроль",
     "keywords": ["власть", "стабильность", "защита"], "image": "m04.jpg"},
    {"id": 5, "name": "The Hierophant", "name_ru": "Иерофант", "meaning": "традиция, соответствие, мораль",
     "keywords": ["традиция", "обучение", "вера"], "image": "m05.jpg"},
    {"id": 6, "name": "The Lovers", "name_ru": "Влюбленные", "meaning": "партнерство, выбор, гармония",
     "keywords": ["любовь", "выбор", "союз"], "image": "m06.jpg"},
    {"id": 7, "name": "The Chariot", "name_ru": "Колесница", "meaning": "воля, решительность, победа",
     "keywords": ["победа", "контроль", "движение"], "image": "m07.jpg"},
    {"id": 8, "name": "Strength", "name_ru": "Сила", "meaning": "внутренняя сила, смелость, терпение",
     "keywords": ["храбрость", "терпение", "контроль"], "image": "m08.jpg"},
    {"id": 9, "name": "The Hermit", "name_ru": "Отшельник", "meaning": "самоанализ, поиск, руководство",
     "keywords": ["поиск", "мудрость", "одиночество"], "image": "m09.jpg"},
    {"id": 10, "name": "Wheel of Fortune", "name_ru": "Колесо Фортуны", "meaning": "удача, карма, жизненные циклы",
     "keywords": ["судьба", "цикл", "удача"], "image": "m10.jpg"},
    {"id": 11, "name": "Justice", "name_ru": "Справедливость", "meaning": "справедливость, правда, закон",
     "keywords": ["баланс", "карма", "правда"], "image": "m11.jpg"},
    {"id": 12, "name": "The Hanged Man", "name_ru": "Повешенный", "meaning": "жертва, отпускание, новая перспектива",
     "keywords": ["пауза", "жертва", "просветление"], "image": "m12.jpg"},
    {"id": 13, "name": "Death", "name_ru": "Смерть", "meaning": "окончание, трансформация, переход",
     "keywords": ["конец", "трансформация", "обновление"], "image": "m13.jpg"},
    {"id": 14, "name": "Temperance", "name_ru": "Умеренность", "meaning": "баланс, умеренность, терпение",
     "keywords": ["баланс", "исцеление", "гармония"], "image": "m14.jpg"},
    {"id": 15, "name": "The Devil", "name_ru": "Дьявол", "meaning": "зависимость, материализм, игривость",
     "keywords": ["искушение", "привязанность", "материализм"], "image": "m15.jpg"},
    {"id": 16, "name": "The Tower", "name_ru": "Башня", "meaning": "внезапные изменения, освобождение, откровение",
     "keywords": ["крах", "освобождение", "прозрение"], "image": "m16.jpg"},
    {"id": 17, "name": "The Star", "name_ru": "Звезда", "meaning": "надежда, вера, обновление",
     "keywords": ["надежда", "вдохновение", "духовность"], "image": "m17.jpg"},
    {"id": 18, "name": "The Moon", "name_ru": "Луна", "meaning": "иллюзии, страх, беспокойство",
     "keywords": ["иллюзия", "интуиция", "подсознание"], "image": "m18.jpg"},
    {"id": 19, "name": "The Sun", "name_ru": "Солнце", "meaning": "радость, успех, праздник",
     "keywords": ["успех", "радость", "ясность"], "image": "m19.jpg"},
    {"id": 20, "name": "Judgement", "name_ru": "Суд", "meaning": "размышление, расплата, внутренний призыв",
     "keywords": ["возрождение", "решение", "призвание"], "image": "m20.jpg"},
    {"id": 21, "name": "The World", "name_ru": "Мир", "meaning": "завершение, достижение, путешествие",
     "keywords": ["завершение", "успех", "целостность"], "image": "m21.jpg"}
]

MINOR_ARCANA_SUITS = {
    "cups": {"name": "Cups", "name_ru": "Кубки", "element": "Вода", "prefix": "c"},
    "pentacles": {"name": "Pentacles", "name_ru": "Пентакли", "element": "Земля", "prefix": "p"},
    "swords": {"name": "Swords", "name_ru": "Мечи", "element": "Воздух", "prefix": "s"},
    "wands": {"name": "Wands", "name_ru": "Жезлы", "element": "Огонь", "prefix": "w"}
}

MINOR_ARCANA_RANKS = [
    {"rank": 1, "name": "Ace", "name_ru": "Туз", "meaning": "новое начало, потенциал"},
    {"rank": 2, "name": "Two", "name_ru": "Двойка", "meaning": "баланс, партнерство"},
    {"rank": 3, "name": "Three", "name_ru": "Тройка", "meaning": "рост, творчество"},
    {"rank": 4, "name": "Four", "name_ru": "Четверка", "meaning": "стабильность, основа"},
    {"rank": 5, "name": "Five", "name_ru": "Пятерка", "meaning": "конфликт, вызов"},
    {"rank": 6, "name": "Six", "name_ru": "Шестерка", "meaning": "гармония, успех"},
    {"rank": 7, "name": "Seven", "name_ru": "Семерка", "meaning": "размышление, оценка"},
    {"rank": 8, "name": "Eight", "name_ru": "Восьмерка", "meaning": "движение, прогресс"},
    {"rank": 9, "name": "Nine", "name_ru": "Девятка", "meaning": "достижение, завершение"},
    {"rank": 10, "name": "Ten", "name_ru": "Десятка", "meaning": "кульминация, полнота"},
    {"rank": 11, "name": "Page", "name_ru": "Паж", "meaning": "начинающий, посланник"},
    {"rank": 12, "name": "Knight", "name_ru": "Рыцарь", "meaning": "действие, движение"},
    {"rank": 13, "name": "Queen", "name_ru": "Королева", "meaning": "зрелость, забота"},
    {"rank": 14, "name": "King", "name_ru": "Король", "meaning": "мастерство, власть"}
]


def create_full_deck():
    deck = MAJOR_ARCANA.copy()
    card_id = 22

    for suit_key, suit_data in MINOR_ARCANA_SUITS.items():
        for rank_data in MINOR_ARCANA_RANKS:
            rank_num = rank_data["rank"]

            if rank_num <= 10:
                image_file = f"{suit_data['prefix']}{str(rank_num).zfill(2)}.jpg"
            else:
                image_file = f"{suit_data['prefix']}{str(rank_num).zfill(2)}.jpg"

            card_name = f"{rank_data['name']} of {suit_data['name']}"
            card_name_ru = f"{rank_data['name_ru']} {suit_data['name_ru']}"

            if rank_data["name"] == "Ace":
                meaning = f"новое начало в сфере {suit_data['name_ru'].lower()}, чистый потенциал {suit_data['element'].lower()}"
            elif rank_data["rank"] >= 11:
                meaning = f"{rank_data['meaning']} в контексте {suit_data['element'].lower()}"
            else:
                meaning = f"{rank_data['meaning']}, энергия {suit_data['element'].lower()}"

            deck.append({
                "id": card_id,
                "name": card_name,
                "name_ru": card_name_ru,
                "meaning": meaning,
                "keywords": [],
                "suit": suit_data["name"],
                "suit_ru": suit_data["name_ru"],
                "rank": rank_data["name"],
                "rank_ru": rank_data["name_ru"],
                "element": suit_data["element"],
                "image": image_file
            })
            card_id += 1

    return deck


FULL_DECK = create_full_deck()


class ReadingRequest(BaseModel):
    question: str
    spread_type: str
    language: str = "ru"


class Card(BaseModel):
    id: int
    name: str
    name_ru: str
    meaning: str
    keywords: List[str]
    position: Optional[str] = None
    reversed: bool = False
    image: Optional[str] = None


class ReadingResponse(BaseModel):
    session_id: str
    question: str
    spread_type: str
    cards: List[Card]
    interpretation: str
    timestamp: str


class InterpretationRequest(BaseModel):
    question: str
    cards: List[Card]
    spread_type: str


sessions = {}


def get_spread_positions(spread_type: str) -> List[str]:
    if spread_type == "single":
        return ["Ситуация"]
    elif spread_type == "three":
        return ["Прошлое", "Настоящее", "Будущее"]
    elif spread_type == "celtic":
        return [
            "Текущая ситуация", "Вызов/Крест", "Далекое прошлое",
            "Недавнее прошлое", "Возможное будущее", "Ближайшее будущее",
            "Ваш подход", "Внешние влияния", "Надежды и страхи",
            "Финальный результат"
        ]
    elif spread_type == "relationship":
        return ["Вы", "Партнер", "Связь", "Сильные стороны", "Слабые стороны", "Совет"]
    elif spread_type == "horseshoe":
        return ["Прошлое", "Настоящее", "Будущее", "Путь", "Влияния других", "Препятствия", "Результат"]
    return []


def draw_cards(spread_type: str) -> List[Card]:
    positions = get_spread_positions(spread_type)
    num_cards = len(positions)

    shuffled_deck = FULL_DECK.copy()
    random.shuffle(shuffled_deck)

    drawn_cards = []
    for i in range(num_cards):
        card_data = shuffled_deck[i]
        card = Card(
            id=card_data["id"],
            name=card_data["name"],
            name_ru=card_data["name_ru"],
            meaning=card_data["meaning"],
            keywords=card_data.get("keywords", []),
            position=positions[i],
            reversed=random.random() < 0.3,
            image=card_data.get("image")
        )
        drawn_cards.append(card)

    return drawn_cards


async def ai_interpretation(question: str, cards: List[Card], spread_type: str) -> str:
    cards_description = []
    for card in cards:
        reversed_text = " (перевернутая)" if card.reversed else ""
        cards_description.append(
            f"- Позиция '{card.position}': {card.name_ru}{reversed_text}. Ключевое значение: {card.meaning}.")

    cards_text = "\n".join(cards_description)

    prompt = f"""
    Выступи в роли опытного таролога.
    Дай глубокое, но понятное толкование расклада таро, синтезируя значения карт в единый рассказ.
    Не используй вступлений или заключений, предоставь только само толкование.
    Структурируй ответ: начни с общего вывода, затем кратко раскрой значение каждой карты в ее позиции, и закончи синтезированным советом.

    Вопрос пользователя: "{question}"
    Тип расклада: "{spread_type}"
    Выпавшие карты:
    {cards_text}

    Твое толкование:
    """
    
    try:
        # Таймаут 15 секунд
        response = await asyncio.wait_for(
            g4f.ChatCompletion.create_async(
                model=g4f.models.gpt_4o_mini,
                messages=[{"role": "user", "content": prompt}],
            ),
            timeout=15.0
        )
        return response
    except asyncio.TimeoutError:
        # Fallback при таймауте
        return generate_simple_interpretation(question, cards, spread_type)
    except Exception as e:
        # Fallback при любой ошибке
        return generate_simple_interpretation(question, cards, spread_type)


def generate_simple_interpretation(question: str, cards: List[Card], spread_type: str) -> str:
    """Fallback интерпретация"""
    interpretation = f"🔮 **Толкование расклада**\n\n"
    interpretation += f"**Ваш вопрос:** {question}\n\n"
    
    for card in cards:
        reversed_text = " (перевернутая)" if card.reversed else ""
        interpretation += f"**{card.position}:** {card.name_ru}{reversed_text}\n"
        interpretation += f"_{card.meaning}_\n\n"
        
        if card.reversed:
            interpretation += f"_Перевернутое положение предлагает взглянуть на ситуацию с другой стороны._\n\n"
    
    interpretation += f"\n**Общий совет:** Обратите внимание на взаимосвязь всех карт. "
    
    if len(cards) >= 3:
        interpretation += f"Первая карта ({cards[0].name_ru}) задаёт основной тон. "
        interpretation += f"Последняя карта ({cards[-1].name_ru}) указывает на возможный исход."
    
    return interpretation


@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Mystic Tarot API</title>
        <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px; text-align: center; }
            h1 { font-size: 3em; margin-bottom: 20px; }
            p { font-size: 1.2em; }
            a { color: #ffd700; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <h1>🔮 Mystic Tarot API</h1>
        <p>Добро пожаловать в API для гадания на картах Таро!</p>
        <p><a href="/docs">📚 Документация API</a></p>
        <p><a href="/redoc">📖 ReDoc</a></p>
    </body>
    </html>
    """


@app.get("/api/cards")
async def get_all_cards():
    return {"cards": FULL_DECK, "total": len(FULL_DECK)}


@app.get("/api/cards/{card_id}")
async def get_card(card_id: int):
    card = next((c for c in FULL_DECK if c["id"] == card_id), None)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@app.get("/api/spreads")
async def get_spreads():
    return {
        "spreads": [
            {"id": "single", "name": "Одна карта", "description": "Быстрый ответ на вопрос", "cards": 1},
            {"id": "three", "name": "Три карты", "description": "Прошлое, настоящее, будущее", "cards": 3},
            {"id": "celtic", "name": "Кельтский крест", "description": "Глубокий анализ ситуации", "cards": 10},
            {"id": "relationship", "name": "Отношения", "description": "Анализ партнерства", "cards": 6},
            {"id": "horseshoe", "name": "Подкова", "description": "Развитие ситуации", "cards": 7}
        ]
    }


@app.post("/api/reading")
async def create_reading(request: ReadingRequest):
    session_id = hashlib.md5(f"{request.question}{datetime.now()}".encode()).hexdigest()
    cards = draw_cards(request.spread_type)
    interpretation = await ai_interpretation(request.question, cards, request.spread_type)

    reading = ReadingResponse(
        session_id=session_id,
        question=request.question,
        spread_type=request.spread_type,
        cards=cards,
        interpretation=interpretation,
        timestamp=datetime.now().isoformat()
    )
    sessions[session_id] = reading
    return reading


@app.get("/api/reading/{session_id}")
async def get_reading(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Reading session not found")
    return sessions[session_id]


@app.post("/api/interpret")
async def interpret_cards(request: InterpretationRequest):
    interpretation = await ai_interpretation(request.question, request.cards, request.spread_type)
    return {"interpretation": interpretation}


@app.get("/api/daily")
async def daily_card():
    today = datetime.now().strftime("%Y-%m-%d")
    seed = int(hashlib.md5(today.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    card_data = random.choice(FULL_DECK)
    card = Card(
        id=card_data["id"], name=card_data["name"], name_ru=card_data["name_ru"],
        meaning=card_data["meaning"], keywords=card_data.get("keywords", []),
        reversed=random.random() < 0.3
    )
    message = f"Карта дня: {card.name_ru}"
    if card.reversed:
        message += " (перевернутая)"
    message += f"\n\n{card.meaning}"
    if card.reversed:
        message += "\n\nПеревернутое положение предлагает взглянуть на ситуацию с другой стороны или обратить внимание на внутренние препятствия."

    return {"date": today, "card": card, "message": message}


@app.websocket("/ws/live-reading")
async def websocket_reading(websocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("action") == "shuffle":
                for i in range(5):
                    await websocket.send_json({"status": "shuffling", "progress": (i + 1) * 20})
                    await asyncio.sleep(0.3)
                await websocket.send_json({"status": "ready"})
            elif data.get("action") == "draw":
                spread_type = data.get("spread_type", "single")
                cards = draw_cards(spread_type)
                for i, card in enumerate(cards):
                    await asyncio.sleep(0.5)
                    await websocket.send_json({"status": "card_drawn", "index": i, "card": card.dict()})
                await websocket.send_json({"status": "complete", "cards": [c.dict() for c in cards]})
            elif data.get("action") == "interpret":
                question = data.get("question", "")
                cards_data = data.get("cards", [])
                spread_type = data.get("spread_type", "single")
                cards = [Card(**c) for c in cards_data]
                interpretation = await ai_interpretation(question, cards, spread_type)
                await websocket.send_json({"status": "interpretation", "text": interpretation})
    except Exception as e:
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
