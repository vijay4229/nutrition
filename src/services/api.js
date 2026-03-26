const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ✅ CORE API CALL (v1 endpoint)
async function callGemini(prompt) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ API ERROR:", data);
      throw new Error(data.error?.message || "API Error");
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("🔥 Fetch Error:", err);
    throw err;
  }
}

// ✅ CLEAN JSON PARSER
function extractJSON(text) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON found");
    }

    return JSON.parse(clean.substring(start, end + 1));
  } catch (err) {
    console.error("❌ JSON ERROR:", text);
    throw new Error("Invalid JSON from AI");
  }
}

// 🥗 MEAL PLAN
export async function generateMealPlan(profile = {}) {
  const prompt = `
You are an expert Indian nutritionist.

Create a 1-day meal plan.

User:
Name: ${profile.name || "User"}
Age: ${profile.age || ""}
Goal: ${profile.goal || ""}
Diet: ${profile.diet || ""}

STRICT:
- Return ONLY JSON
- Exactly 5 meals

FORMAT:
{
  "daily_calories": number,
  "meals": [
    {
      "name": "",
      "type": "",
      "time": "",
      "items": "",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "ingredients": [],
      "recipe": ""
    }
  ],
  "tip": "",
  "water_goal_liters": number
}
`;

  try {
    const text = await callGemini(prompt);
    return extractJSON(text);
  } catch (e) {
    console.warn("⚠️ Using fallback meal plan");

    // ✅ FALLBACK (so UI never breaks)
    return {
      daily_calories: 2000,
      meals: [
        {
          name: "Poha",
          type: "Breakfast",
          time: "8:00 AM",
          items: "Poha with peanuts",
          calories: 300,
          protein: 8,
          carbs: 50,
          fat: 10,
          ingredients: ["Poha", "Peanuts", "Onion"],
          recipe: "Cook poha with spices and peanuts",
        },
        {
          name: "Fruits",
          type: "Mid-Morning Snack",
          time: "11:00 AM",
          items: "Apple + Banana",
          calories: 150,
          protein: 2,
          carbs: 35,
          fat: 1,
          ingredients: ["Apple", "Banana"],
          recipe: "Wash and eat fresh",
        },
        {
          name: "Lunch",
          type: "Lunch",
          time: "1:30 PM",
          items: "Roti + Dal + Sabzi",
          calories: 500,
          protein: 18,
          carbs: 70,
          fat: 15,
          ingredients: ["Wheat", "Lentils", "Vegetables"],
          recipe: "Cook dal and sabzi, serve with roti",
        },
        {
          name: "Tea & Nuts",
          type: "Evening Snack",
          time: "5:00 PM",
          items: "Tea + Almonds",
          calories: 200,
          protein: 6,
          carbs: 15,
          fat: 12,
          ingredients: ["Tea", "Almonds"],
          recipe: "Brew tea, eat nuts",
        },
        {
          name: "Dinner",
          type: "Dinner",
          time: "8:30 PM",
          items: "Rice + Paneer Curry",
          calories: 450,
          protein: 20,
          carbs: 55,
          fat: 18,
          ingredients: ["Rice", "Paneer"],
          recipe: "Cook paneer curry and serve with rice",
        },
      ],
      tip: "Stay hydrated and avoid late-night snacking",
      water_goal_liters: 2.5,
    };
  }
}

// 💬 CHAT COACH
export async function chatWithCoach(messages, profile) {
  const history = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `
You are a friendly Indian nutrition coach.

User goal: ${profile.goal}

Conversation:
${history}

Reply:
`;

  try {
    return await callGemini(prompt);
  } catch {
    return "Sorry, something went wrong.";
  }
}