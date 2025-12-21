# 📦 Загрузка проекта в GitHub

## Быстрая инструкция

### Шаг 1: Проверьте Git

```powershell
cd "C:\Users\Vbelo\OneDrive\Desktop\luvo taro\taro1 (1)\taro1"
git --version
```

Если Git не установлен, скачайте: https://git-scm.com/download/win

### Шаг 2: Инициализируйте репозиторий

```powershell
# Инициализация Git (если ещё не сделано)
git init

# Проверьте что .gitignore создан
dir .gitignore
```

### Шаг 3: Первый коммит

```powershell
# Добавить все файлы
git add .

# Создать коммит
git commit -m "Initial commit - Mystic Tarot Telegram Mini App

Full-stack Tarot reading application:
- Backend: FastAPI with g4f (free GPT-4)
- Frontend: React with Telegram WebApp SDK
- 78 Tarot cards with 5 spread types
- Mobile-optimized for Telegram Mini Apps

🚀 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Шаг 4: Создайте репозиторий на GitHub

**Вариант А - Через GitHub CLI (рекомендуется):**

```powershell
# Установите GitHub CLI если ещё нет
# https://cli.github.com/

# Войдите в GitHub
gh auth login

# Создайте репозиторий и запушьте
gh repo create mystictarot --public --source=. --remote=origin --push
```

**Вариант Б - Через GitHub Website:**

1. Откройте https://github.com/new
2. Repository name: `mystictarot`
3. Visibility: `Public`
4. НЕ создавайте README, .gitignore (уже есть)
5. Нажмите **Create repository**

GitHub покажет команды:

```powershell
git remote add origin https://github.com/ваш-username/mystictarot.git
git branch -M main
git push -u origin main
```

Скопируйте и выполните эти команды в PowerShell!

### Шаг 5: Проверьте

Откройте https://github.com/ваш-username/mystictarot

Вы должны увидеть:
- ✅ Папку `backend/` с Python кодом
- ✅ Папку `frontend/` с React кодом
- ✅ Файлы `.gitignore`, `README.md` и т.д.
- ❌ НЕТ файла `.env` (он в .gitignore!)

---

## ✅ Готово!

Теперь можно деплоить на Render и Vercel!

Следуйте инструкции в `RENDER_DEPLOY_GUIDE.md`
