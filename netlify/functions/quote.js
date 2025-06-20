const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  const { loserName, tone } = JSON.parse(event.body || "{}");

  const tonePrompt = {
    sassy: "with a sassy attitude",
    wise: "like a wise old man",
    pirate: "like a trash-talking pirate",
    auntie: "like a Ghanaian Auntie giving advice",
    kind: "gently, like a kind friend"
  }[tone] || "in a funny way";

  const prompt = `Roast ${loserName} ${tonePrompt}, because they lost in an UNO game.`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
    });

    const quote = chat.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ quote })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ quote: "Roast failed 😢", error: err.message })
    };
  }
};
