# 📖 LughatulQuran — Learn Quranic Arabic Smarter

LughatulQuran is a Quranic Arabic learning web app inspired by the simplicity of Anki and the precision of spaced repetition (SRS). It helps users learn Quranic vocabulary efficiently, while tracking their mastery and daily review streaks.

🚀 Built by [Hamza](https://github.com/hamzaelmi068) as a personal side project to fuse faith + full-stack learning into something impactful.

---

## 🌟 Features

- 📚 **Learn Mode** — Study vocabulary by difficulty level (`beginner`, `intermediate`, `advanced`)
- 🧠 **Smart Review System** — Powered by Spaced Repetition (SRS) with `Again`, `Hard`, `Good`, `Easy` feedback buttons
- 🔁 **Review Queue** — Prioritized review cards based on `ease_factor` and `interval`
- 💡 **Reverse Cards** — Switch from Arabic → English to English → Arabic
- 🏷️ **Word Tags & Decks** — Organize by themes like *Belief*, *Afterlife*, or *Character*
- 🌘 **Dark Mode** — Seamless UI in both light and dark themes
- 🔐 **User Authentication** — Track personal word progress and streaks
- 🔊 **(Coming Soon)** — Audio playback for each word using Quran recitations

---

## 🛠 Tech Stack

| Tech         | Purpose                     |
|--------------|-----------------------------|
| React + Vite | Frontend (fast build setup) |
| TypeScript   | Type safety                 |
| Supabase     | Database + Auth + RLS       |
| Tailwind CSS | Styling + Dark Mode         |
| Vercel       | Hosting + CI/CD             |

---

## 📂 Project Structure

```
📦 lughatul-quran
├── src/
│   ├── pages/           # Learn, Review, Profile
│   ├── hooks/           # useWords (custom Supabase logic)
│   ├── lib/             # supabaseClient, spaced-repetition logic
│   ├── components/      # Flashcard, Layout, Toggle, etc.
├── database.types.ts    # Supabase-generated types
├── tailwind.config.js
├── vercel.json
└── README.md
```

---

## 🔧 Local Development

```bash
# Clone the repo
git clone https://github.com/hamzaelmi068/lughatul-quran.git

# Install dependencies
cd lughatul-quran
npm install

# Run the dev server
npm run dev
```

Make sure to configure your `.env` with your Supabase keys.

---

## 📈 Deployment

Deployed on **[Vercel](https://lughatul-quran.vercel.app)** with Supabase as backend. Continuous deployment is set up via GitHub → Vercel integration.

---

## 🙏 Acknowledgements

- The Noble Quran — for the inspiration and purpose
- Anki — for the spaced repetition learning model
- Supabase — for making backend setup simple and powerful

---

## 💬 Contact

Built with sincerity and love by [Hamza Elmi](https://github.com/hamzaelmi068).  
Feel free to reach out with feedback, suggestions, or a collab idea ✨

---

> _"And We have certainly made the Quran easy to remember. So is there anyone who will be mindful?"_ — Surah Al-Qamar 54:17
