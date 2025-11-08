import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://your-app.com')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    keyboard = [[InlineKeyboardButton("🔮 Открыть Mystic Tarot", web_app=WebAppInfo(url=WEBAPP_URL))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    welcome_text = f"🔮 *Добро пожаловать в Mystic Tarot, {user.first_name}!* 🔮\n\nНажмите кнопку ниже чтобы открыть приложение!"
    if update.message:
        await update.message.reply_text(welcome_text, reply_markup=reply_markup, parse_mode='Markdown')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🔮 *Mystic Tarot*\n\n/start - Главное меню\n/help - Помощь", parse_mode='Markdown')

def main():
    if not BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN не найден!")
        return
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    logger.info("🚀 Запускаю Telegram Mini App бота...")
    logger.info(f"📱 WebApp URL: {WEBAPP_URL}")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
