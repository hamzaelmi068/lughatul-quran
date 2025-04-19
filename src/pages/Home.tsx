import { Book, Lightbulb, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-5xl md:text-6xl font-bold text-center font-arabic">
        لُغَةُ القُرآن
      </h1>
      <p className="text-center text-muted-foreground text-lg mt-3">
        Learn Quranic Arabic through spaced repetition
      </p>
      <button
        onClick={() => navigate('/learn')}
        className="mt-6 px-8 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg text-lg font-medium shadow transition"
      >
        Get Started
      </button>

      <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full text-center">
        {[
          {
            icon: <Book className="mx-auto w-8 h-8 mb-2" />,
            title: 'Comprehensive Vocabulary',
            desc: 'Study essential Quranic words with meanings and context.',
          },
          {
            icon: <Lightbulb className="mx-auto w-8 h-8 mb-2" />,
            title: 'Spaced Repetition',
            desc: 'Proven technique to enhance retention and recall over time.',
          },
          {
            icon: <Search className="mx-auto w-8 h-8 mb-2" />,
            title: 'Track Your Progress',
            desc: 'Review learned words and monitor your journey to mastery.',
          },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-card rounded-xl shadow hover:scale-105 transition">
            {item.icon}
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
