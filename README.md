# LughatulQuran — Smarter Quranic Arabic Learning

**LughatulQuran** is a web app designed to make learning Quranic Arabic vocabulary easier and more consistent.  
It draws inspiration from tools like **Anki**, using spaced repetition to help you retain words through short daily reviews in a clean, focused interface.

🚀 Built by [Hamza](https://github.com/hamzaelmi068) as a personal side project to fuse faith + full-stack learning into something impactful.
This project is a personal effort to make learning smoother and more intentional.

---

## Features

- **Learn Mode** — Vocabulary organized by level (beginner, intermediate, advanced)
- **Spaced Repetition Review** — Rate your recall (“Again,” “Hard,” “Good,” “Easy”) to guide review timing
- **Review Queue** — Cards automatically repeat based on performance
- **Reverse Cards** — Practice in both Arabic → English and English → Arabic
- **Tags & Decks** — Group words by themes (Belief, Afterlife, Character, etc.)
- **Dark Mode** — Works comfortably day or night
- **Personal Accounts** — Log in to save progress and streaks
- **Audio (Coming Soon)** — Hear words directly from Quranic recitations


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

## Deployment

Deployed on **[Vercel](https://lughatul-quran.vercel.app)** with Supabase as backend. Continuous deployment is set up via GitHub → Vercel integration.

---

## Acknowledgements + Resources

- The Noble Quran — for the inspiration and purpose
- Anki — for the spaced repetition learning model
- Supabase — for making backend setup simple and powerful
- https://resources.collins.co.uk/Dictionary/CD%20Resources/Collins_Arabic_3000_words_and_phrases.pdf 

---

## Contact

Built with sincerity and love by [Hamza Elmi](https://github.com/hamzaelmi068).  
Feel free to reach out with feedback, suggestions, or a collab idea ✨

---

> _"And We have certainly made the Quran easy to remember. So is there anyone who will be mindful?"_ — Surah Al-Qamar 54:17
