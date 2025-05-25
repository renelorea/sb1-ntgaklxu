// Sample questions and answers for the domino cards
// These can be replaced with your specific content

type QuestionAnswer = {
  question: string;
  answer: string;
};

export const questionsAnswers: QuestionAnswer[] = [
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
  { question: "What is the chemical symbol for water?", answer: "H₂O" },
  { question: "What year did the Titanic sink?", answer: "1912" },
  { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
  { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
  { question: "What is the tallest mountain in the world?", answer: "Mount Everest" },
  { question: "What is the smallest prime number?", answer: "2" },
  { question: "What element has the chemical symbol 'Au'?", answer: "Gold" },
  { question: "Which planet is known as the Red Planet?", answer: "Mars" },
  { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean" },
  { question: "What is the hardest natural substance on Earth?", answer: "Diamond" },
  { question: "Who discovered penicillin?", answer: "Alexander Fleming" },
  { question: "What is the main component of the Sun?", answer: "Hydrogen" },
  { question: "What is the capital of Japan?", answer: "Tokyo" },
  { question: "What is the speed of light?", answer: "299,792,458 meters per second" },
  { question: "Who is the founder of Microsoft?", answer: "Bill Gates" },
  { question: "What year did World War II end?", answer: "1945" },
  { question: "What is the largest mammal?", answer: "Blue Whale" },
  { question: "What is the currency of the UK?", answer: "Pound Sterling" },
  { question: "What is the freezing point of water in Fahrenheit?", answer: "32°F" },
  { question: "What is the square root of 144?", answer: "12" },
  { question: "Who was the first person to walk on the Moon?", answer: "Neil Armstrong" },
  { question: "What is the national flower of Japan?", answer: "Cherry Blossom" },
  { question: "What is the capital of Australia?", answer: "Canberra" },
  { question: "What is the most abundant gas in Earth's atmosphere?", answer: "Nitrogen" },
  { question: "How many bones are in the human body?", answer: "206" },
  { question: "What is the world's longest river?", answer: "Nile" },
  { question: "What is the boiling point of water in Celsius?", answer: "100°C" },
  { question: "Who developed the theory of relativity?", answer: "Albert Einstein" },
];

export const getRandomQuestionsAnswers = (count: number): QuestionAnswer[] => {
  // Create a copy of the original array
  const shuffled = [...questionsAnswers];
  
  // Shuffle the array using Fisher-Yates algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' elements
  return shuffled.slice(0, count);
};