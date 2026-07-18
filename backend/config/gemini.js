import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = 'gemini-3.1-flash-lite';

export const categorizeExpense = async (note) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `You are a categorization assistant for an Indian expense tracker app. The user's expense note may be in English, Hindi, or Hinglish (code-mixed Hindi-English).

Categorize the following expense note into EXACTLY ONE of these categories:

- Food: meals, snacks, chai, groceries, restaurants (e.g. "chai aur samosa", "grocery shopping")
- Transport: auto, cab, bus, train, petrol, parking, metro (e.g. "auto mein gaya office")
- Shopping: clothes, electronics, accessories, online shopping, gadgets (e.g. "kapde khareede", "naya phone liya")
- Bills: rent, electricity, phone recharge, subscriptions, utilities (e.g. "bijli ka bill", "wifi recharge")
- Entertainment: movies, outings, games, streaming, parties (e.g. "movie dekhne gaya", "netflix subscription")
- Health: medicines, doctor visits, gym, health checkups, hospital, eye checkups (e.g. "dawai li", "gym fees")
- Other: anything that doesn't clearly fit above

Expense note: "${note}"

Respond with ONLY the category word, nothing else. No explanation, no punctuation.`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();

    const validCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

    return validCategories.includes(category) ? category : 'Other';
  } catch (err) {
    console.log('Gemini categorization error:', err.message);
    return 'Other';
  }
};

export const generateInsights = async (transactions) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const summary = transactions
      .map(t => `₹${t.amount} - ${t.category} - ${t.note} - ${t.date.toISOString().split('T')[0]}`)
      .join('\n');

    const prompt = `You are a friendly financial assistant for an Indian user. Below is their list of expenses for a period. Give a short, plain-language summary (3-4 sentences max) highlighting: 
1. Total spending pattern
2. The category they spent the most on
3. Any notable spike or unusual pattern
4. One encouraging or practical observation

Keep the tone warm and simple, like a helpful friend, not a formal report. Use ₹ for currency.

Expenses:
${summary}

Respond with ONLY the summary text, no headers, no bullet points.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.log('Gemini insights error:', err.message);
    return 'Unable to generate insights right now. Please try again later.';
  }
};