import type { Book, Category, Publisher, Order } from '../types';

export const categories: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'romance', name: 'Romance' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'science-fiction', name: 'Science Fiction' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'historical', name: 'Historical' },
  { id: 'biography', name: 'Biography' },
  { id: 'self-help', name: 'Self-help' },
  { id: 'memoir', name: 'Memoir' },
  { id: 'travel', name: 'Travel' },
  { id: 'cooking', name: 'Cooking' },
  { id: 'childrens', name: "Children's" },
  { id: 'young-adult', name: 'Young Adult' },
  { id: 'comics', name: 'Comics & Graphic Novels' },
  { id: 'poetry', name: 'Poetry' },
  { id: 'drama', name: 'Drama' },
  { id: 'science', name: 'Science' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'religion', name: 'Religion' },
  { id: 'language-learning', name: 'Language Learning' },
];

export const publishers: Publisher[] = [
  { id: 'penguin', name: 'Penguin Books', logoColor: '#e87722', logoText: 'PENGUIN', bookCount: 142 },
  { id: 'harper', name: 'HarperCollins', logoColor: '#003087', logoText: 'HC', bookCount: 98 },
  { id: 'random', name: 'Random House', logoColor: '#cc0000', logoText: 'RH', bookCount: 115 },
  { id: 'simon', name: 'Simon & Schuster', logoColor: '#1a1a2e', logoText: 'S&S', bookCount: 76 },
  { id: 'macmillan', name: 'Macmillan', logoColor: '#2563eb', logoText: 'MAC', bookCount: 89 },
  { id: 'oxford', name: 'Oxford Press', logoColor: '#7c3aed', logoText: 'OUP', bookCount: 203 },
  { id: 'scholastic', name: 'Scholastic', logoColor: '#dc2626', logoText: 'SCH', bookCount: 67 },
  { id: 'bloomsbury', name: 'Bloomsbury', logoColor: '#059669', logoText: 'BLM', bookCount: 54 },
];

export const allBooks: Book[] = [
  // Self-help
  {
    id: 1, title: 'The Art of Focus', author: 'Arjun Patel', price: 399, originalPrice: 499,
    coverColor: '#e05c3a', coverTextColor: '#ffffff', format: 'Paperback',
    genres: ['Non-fiction', 'Self Help'], categoryId: 'self-help', publisherId: 'penguin',
    deliveryDate: 'Mon, 21 Jul', rating: 4.5, ratingCount: 1284,
    description: 'A practical guide to mastering focus & boosting productivity every day. Learn to cut through distractions and achieve deep work.',
    pages: 256, language: 'English', isbn: '978-0-14-028329-7',
  },
  {
    id: 2, title: 'The Art of Learning', author: 'Raj Patel', price: 259, originalPrice: 349,
    coverColor: '#e8371d', coverTextColor: '#ffffff', format: 'Paperback',
    genres: ['Non-fiction', 'Self Help'], categoryId: 'self-help', publisherId: 'harper',
    deliveryDate: 'Mon, 21 Jul', rating: 4.3, ratingCount: 892,
    description: "Master the mindset and methods for effective lifelong learning. Discover how the world's best learners acquire skills faster.",
    pages: 288, language: 'English', isbn: '978-0-06-112008-4',
  },
  {
    id: 3, title: 'The Path to Success', author: 'James Wright', price: 359,
    coverColor: '#1a5fa8', coverTextColor: '#f5c518', format: 'Paperback',
    genres: ['Non-fiction', 'Self Help'], categoryId: 'self-help', publisherId: 'random',
    deliveryDate: 'Mon, 21 Jul', rating: 4.1, ratingCount: 643,
    description: 'A practical guide to achieving goals with clarity and confidence. Build habits that last and routines that compound.',
    pages: 224, language: 'English', isbn: '978-0-385-54734-3',
  },
  {
    id: 10, title: 'Atomic Habits', author: 'James Clear', price: 449, originalPrice: 599,
    coverColor: '#1e293b', coverTextColor: '#fbbf24', format: 'Paperback',
    genres: ['Non-fiction', 'Self Help', 'Psychology'], categoryId: 'self-help', publisherId: 'penguin',
    deliveryDate: 'Tue, 22 Jul', rating: 4.8, ratingCount: 5120,
    description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.',
    pages: 320, language: 'English', isbn: '978-0-7352-1129-3',
  },
  {
    id: 11, title: 'Deep Work', author: 'Cal Newport', price: 379,
    coverColor: '#374151', coverTextColor: '#ffffff', format: 'Hard Cover',
    genres: ['Non-fiction', 'Self Help', 'Productivity'], categoryId: 'self-help', publisherId: 'harper',
    deliveryDate: 'Wed, 23 Jul', rating: 4.6, ratingCount: 2847,
    description: 'Rules for focused success in a distracted world. The ability to perform deep work is becoming both rare and valuable.',
    pages: 296, language: 'English', isbn: '978-1-4555-8666-0',
  },
  // Fiction / Thriller
  {
    id: 4, title: 'The Midnight Hour', author: 'James Adams', price: 299,
    coverColor: '#1a1a2e', coverTextColor: '#ffffff', format: 'Paperback',
    genres: ['Fiction', 'Thriller', 'Horror'], categoryId: 'mystery', publisherId: 'simon',
    deliveryDate: 'Mon, 21 Jul', rating: 4.4, ratingCount: 1876,
    description: "A haunting tale of a man's journey and the shadows of a forgotten past. Every secret has a price.",
    pages: 368, language: 'English', isbn: '978-1-5011-6340-5',
  },
  {
    id: 5, title: 'Beneath the Stars', author: 'Jessica Martin', price: 499,
    coverColor: '#2d1b4e', coverTextColor: '#ffffff', format: 'Hard Cover',
    genres: ['Fiction', 'Love', 'Drama'], categoryId: 'romance', publisherId: 'bloomsbury',
    deliveryDate: 'Mon, 21 Jul', rating: 4.7, ratingCount: 3241,
    description: 'A heartwarming tale where two souls discover who they need. Love finds a way even through the darkest nights.',
    pages: 412, language: 'English', isbn: '978-1-4088-5717-1',
  },
  {
    id: 6, title: 'The Final Frontier', author: 'Laura Mitchell', price: 359,
    coverColor: '#0d2137', coverTextColor: '#ffffff', format: 'Paperback',
    genres: ['Fiction', 'Thriller', 'Science Fiction'], categoryId: 'science-fiction', publisherId: 'macmillan',
    deliveryDate: 'Mon, 21 Jul', rating: 4.2, ratingCount: 987,
    description: 'From mission secrets to space rockets — a race to change humanity forever. The stars hold more than light.',
    pages: 344, language: 'English', isbn: '978-1-250-31405-7',
  },
  // New launches
  {
    id: 7, title: 'The Joy of Minimalism', author: 'Daniel Reed', price: 149,
    coverColor: '#f5c518', coverTextColor: '#1a1a1a', format: 'Paperback',
    genres: ['Non-fiction', 'Self Help', 'Lifestyle'], categoryId: 'self-help', publisherId: 'penguin',
    deliveryDate: 'Mon, 21 Jul', rating: 4.0, ratingCount: 412,
    description: 'Declutter your life to uncover peace, clarity, and joy. A practical introduction to minimalist living.',
    pages: 192, language: 'English', isbn: '978-0-525-55360-5',
  },
  {
    id: 8, title: 'The Vanishing House', author: 'Clara Nelson', price: 99,
    coverColor: '#1c2a1c', coverTextColor: '#c8e6c9', format: 'eBook',
    genres: ['Fiction', 'Horror', 'Mystery'], categoryId: 'mystery', publisherId: 'random',
    deliveryDate: 'Mon, 21 Jul', rating: 3.9, ratingCount: 234,
    description: "A chilling mystery unfolds within a house that disappears. No one believes what they can't see.",
    pages: 280, language: 'English', isbn: '978-0-385-54520-2',
  },
  {
    id: 9, title: 'The Lost Kitten', author: 'Emily Parker', price: 339,
    coverColor: '#e8a020', coverTextColor: '#ffffff', format: 'Hard Cover',
    genres: ['Fiction', "Children's", 'Adventure'], categoryId: 'childrens', publisherId: 'scholastic',
    deliveryDate: 'Mon, 21 Jul', rating: 4.6, ratingCount: 782,
    description: 'A heartwarming tale of courage, friendship, and feline adventure. Perfect for young readers aged 5–8.',
    pages: 96, language: 'English', isbn: '978-0-439-02348-1',
  },
  // Mystery
  {
    id: 12, title: 'Gone at Dawn', author: 'Sarah Connors', price: 279,
    coverColor: '#312e81', coverTextColor: '#e0e7ff', format: 'Paperback',
    genres: ['Fiction', 'Mystery', 'Thriller'], categoryId: 'mystery', publisherId: 'random',
    deliveryDate: 'Thu, 24 Jul', rating: 4.3, ratingCount: 1103,
    description: "A detective wakes to find the town's only witness has vanished. The clock is already ticking.",
    pages: 316, language: 'English', isbn: '978-0-385-54521-9',
  },
  {
    id: 13, title: 'Shadow Protocol', author: 'Mark Enson', price: 319,
    coverColor: '#0f172a', coverTextColor: '#94a3b8', format: 'Paperback',
    genres: ['Fiction', 'Thriller', 'Espionage'], categoryId: 'mystery', publisherId: 'harper',
    deliveryDate: 'Fri, 25 Jul', rating: 4.5, ratingCount: 1560,
    description: 'An intelligence operative uncovers a conspiracy that reaches the highest levels of power.',
    pages: 392, language: 'English', isbn: '978-0-06-234567-8',
  },
  // Romance
  {
    id: 14, title: 'Letters to You', author: 'Priya Sharma', price: 229,
    coverColor: '#be185d', coverTextColor: '#fce7f3', format: 'Paperback',
    genres: ['Fiction', 'Romance', 'Drama'], categoryId: 'romance', publisherId: 'bloomsbury',
    deliveryDate: 'Tue, 22 Jul', rating: 4.4, ratingCount: 2109,
    description: 'Two strangers exchange letters across continents, finding love one word at a time.',
    pages: 304, language: 'English', isbn: '978-1-4088-9821-2',
  },
  {
    id: 15, title: 'A Summer Promise', author: 'Meera Nair', price: 199,
    coverColor: '#ea580c', coverTextColor: '#fff7ed', format: 'eBook',
    genres: ['Fiction', 'Romance'], categoryId: 'romance', publisherId: 'penguin',
    deliveryDate: 'Mon, 21 Jul', rating: 4.1, ratingCount: 876,
    description: 'A promise made in summer that changes two lives forever. Sometimes a season is all it takes.',
    pages: 256, language: 'English', isbn: '978-0-14-312456-9',
  },
  // Science Fiction
  {
    id: 16, title: 'Nexus Prime', author: 'Vikram Rao', price: 399, originalPrice: 499,
    coverColor: '#0e7490', coverTextColor: '#cffafe', format: 'Hard Cover',
    genres: ['Fiction', 'Science Fiction', 'Dystopia'], categoryId: 'science-fiction', publisherId: 'macmillan',
    deliveryDate: 'Wed, 23 Jul', rating: 4.6, ratingCount: 1450,
    description: 'In 2147, a programmer discovers the world is running on corrupted code. Can she rewrite reality?',
    pages: 448, language: 'English', isbn: '978-1-250-87654-3',
  },
  {
    id: 17, title: 'Echo Station', author: 'Ananya Das', price: 299,
    coverColor: '#1e3a5f', coverTextColor: '#7dd3fc', format: 'Paperback',
    genres: ['Fiction', 'Science Fiction', 'Space'], categoryId: 'science-fiction', publisherId: 'simon',
    deliveryDate: 'Thu, 24 Jul', rating: 4.2, ratingCount: 732,
    description: 'Stranded on an isolated space station, the crew discovers they are not alone in the universe.',
    pages: 320, language: 'English', isbn: '978-1-5011-9876-3',
  },
  // Fantasy
  {
    id: 18, title: 'The Iron Crown', author: 'Rohan Mehta', price: 449, originalPrice: 549,
    coverColor: '#78350f', coverTextColor: '#fde68a', format: 'Hard Cover',
    genres: ['Fiction', 'Fantasy', 'Adventure'], categoryId: 'fantasy', publisherId: 'bloomsbury',
    deliveryDate: 'Mon, 21 Jul', rating: 4.7, ratingCount: 2987,
    description: "A young blacksmith discovers a crown that grants power — and demands sacrifice. The realm's fate rests in untested hands.",
    pages: 512, language: 'English', isbn: '978-1-4088-6543-2',
  },
  {
    id: 19, title: 'Ember & Ash', author: 'Kavya Singh', price: 319,
    coverColor: '#7c2d12', coverTextColor: '#fed7aa', format: 'Paperback',
    genres: ['Fiction', 'Fantasy', 'Magic'], categoryId: 'fantasy', publisherId: 'random',
    deliveryDate: 'Tue, 22 Jul', rating: 4.4, ratingCount: 1234,
    description: 'Two elemental mages from rival clans must unite to prevent an ancient catastrophe.',
    pages: 384, language: 'English', isbn: '978-0-385-67890-1',
  },
  // Biography
  {
    id: 20, title: 'Wings of Change', author: 'Nandita Roy', price: 299,
    coverColor: '#166534', coverTextColor: '#dcfce7', format: 'Hard Cover',
    genres: ['Non-fiction', 'Biography', 'Inspiration'], categoryId: 'biography', publisherId: 'oxford',
    deliveryDate: 'Mon, 21 Jul', rating: 4.5, ratingCount: 890,
    description: 'The extraordinary life of a pioneering aviator who broke every barrier to reach the sky.',
    pages: 368, language: 'English', isbn: '978-0-19-876543-2',
  },
  // Children's
  {
    id: 21, title: 'Dragon in the Garden', author: 'Sunita Rao', price: 189,
    coverColor: '#16a34a', coverTextColor: '#ffffff', format: 'Hard Cover',
    genres: ["Children's", 'Fantasy', 'Adventure'], categoryId: 'childrens', publisherId: 'scholastic',
    deliveryDate: 'Tue, 22 Jul', rating: 4.8, ratingCount: 1245,
    description: 'A tiny dragon discovers a magical garden full of secrets — and a human child who needs a friend.',
    pages: 112, language: 'English', isbn: '978-0-439-87654-3',
  },
];

export const recommendedBooks = allBooks.filter((b) => [1, 2, 3].includes(b.id));
export const bestsellerBooks = allBooks.filter((b) => [4, 5, 6].includes(b.id));
export const newLaunchBooks = allBooks.filter((b) => [7, 8, 9].includes(b.id));

const curatedIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
export const remainingBooks = allBooks.filter((b) => !curatedIds.has(b.id));

export const sampleOrders: Order[] = [
  {
    id: 'ORD-10045', date: '12 Jul 2025', status: 'Delivered', deliveredOn: '15 Jul 2025', total: 1097,
    items: [
      { book: allBooks[0], quantity: 1, priceAtPurchase: 399 },
      { book: allBooks[9], quantity: 1, priceAtPurchase: 449 },
      { book: allBooks[2], quantity: 1, priceAtPurchase: 249 },
    ],
  },
  {
    id: 'ORD-10031', date: '28 Jun 2025', status: 'Delivered', deliveredOn: '1 Jul 2025', total: 758,
    items: [
      { book: allBooks[4], quantity: 1, priceAtPurchase: 499 },
      { book: allBooks[7], quantity: 1, priceAtPurchase: 99 },
      { book: allBooks[6], quantity: 1, priceAtPurchase: 149 },
    ],
  },
  {
    id: 'ORD-10024', date: '10 Jun 2025', status: 'Delivered', deliveredOn: '13 Jun 2025', total: 638,
    items: [
      { book: allBooks[3], quantity: 1, priceAtPurchase: 299 },
      { book: allBooks[5], quantity: 1, priceAtPurchase: 339 },
    ],
  },
  {
    id: 'ORD-10017', date: '20 May 2025', status: 'Delivered', deliveredOn: '23 May 2025', total: 379,
    items: [{ book: allBooks[10], quantity: 1, priceAtPurchase: 379 }],
  },
];
