import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MealPlan from "../components/MealPlan";
import ChatCoach from "../components/ChatCoach";
import { generateMealPlan } from "../services/api";

export default function MealPlanPage() {
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  useEffect(() => { fetchPlan(); }, []);

  async function fetchPlan() {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateMealPlan(profile);
      setMealPlan(plan);
      const history = JSON.parse(localStorage.getItem("mealHistory") || "[]");
      history.unshift({ date: new Date().toLocaleDateString("en-IN"), plan });
      localStorage.setItem("mealHistory", JSON.stringify(history.slice(0, 7)));
    } catch (e) {
      setError("Could not generate meal plan. Check your API key in .env file.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-display text-xl text-saffron">🌿 AaharAI</h1>
        <div className="flex gap-3">
          <button onClick={fetchPlan} className="btn-secondary text-sm py-2">🔄 New Plan</button>
          <button onClick={() => navigate("/dashboard")} className="btn-primary text-sm py-2">📊 Dashboard</button>
          <button onClick={() => { localStorage.clear(); navigate("/"); }} className="text-gray-400 text-sm hover:text-gray-600 px-3">Reset</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="font-display text-3xl text-gray-800">Namaste, {profile.name || "Friend"}! 🙏</h2>
          <p className="text-gray-500 mt-1">Here's your personalized meal plan for today</p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">🍛</div>
            <p className="text-gray-500 font-semibold">Crafting your perfect Indian meal plan...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {mealPlan && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MealPlan plan={mealPlan} onRegenerate={fetchPlan} />
            </div>
            <div>
              <ChatCoach profile={profile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}