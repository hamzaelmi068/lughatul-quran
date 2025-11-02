/*
  # Add initial Quranic vocabulary words
  
  1. Changes
    - Insert 15 essential Quranic words with their meanings and references
    - Words span across beginner, intermediate, and advanced levels
    - Each word includes Arabic text, English translation, root, and ayah reference
*/

INSERT INTO words (arabic, english, root, ayah, surah, ayah_number, created_at, updated_at)
VALUES 
  ('صلاة', 'Prayer', 'ص-ل-و', 'And establish prayer...', 'Al-Baqarah', 3, now(), now()),
  ('إيمان', 'Faith', 'أ-م-ن', 'And of the people are some who say...', 'Al-Baqarah', 9, now(), now()),
  ('كتب', 'Books', 'ك-ت-ب', 'This is the Book...', 'Al-Baqarah', 2, now(), now()),
  ('نار', 'Fire', 'ن-و-ر', 'O you who have believed, protect yourselves...', 'At-Tahrim', 6, now(), now()),
  ('جنة', 'Paradise', 'ج-ن-ن', 'Allah has promised the believing men...', 'At-Tawbah', 72, now(), now()),
  ('بر', 'Righteousness', 'ب-ر-ر', 'Righteousness is not that you turn your faces...', 'Al-Baqarah', 177, now(), now()),
  ('تقوى', 'God-consciousness', 'و-ق-ي', 'And take provisions, but indeed...', 'Al-Baqarah', 197, now(), now()),
  ('شكر', 'Gratitude', 'ش-ك-ر', 'And [remember] when your Lord proclaimed...', 'Ibrahim', 7, now(), now()),
  ('كفر', 'Disbelief', 'ك-ف-ر', 'Indeed, those who disbelieve...', 'Al-Baqarah', 6, now(), now()),
  ('هداية', 'Guidance', 'ه-د-ي', 'This is the Book about which there is no doubt...', 'Al-Baqarah', 2, now(), now()),
  ('استغفار', 'Seeking forgiveness', 'غ-ف-ر', 'And those who, when they commit an immorality...', 'Ali Imran', 135, now(), now()),
  ('موعظة', 'Admonition', 'و-ع-ظ', 'O mankind, there has come to you instruction...', 'Yunus', 57, now(), now()),
  ('دعوة', 'Invitation', 'د-ع-و', 'Invite to the way of your Lord...', 'An-Nahl', 125, now(), now()),
  ('تدبر', 'Contemplation', 'د-ب-ر', 'Then do they not reflect upon the Quran...', 'Muhammad', 24, now(), now()),
  ('إخلاص', 'Sincerity', 'خ-ل-ص', 'And they were not commanded except to worship Allah...', 'Al-Bayyinah', 5, now(), now());