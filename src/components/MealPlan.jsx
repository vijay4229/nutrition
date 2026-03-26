import { useState } from "react";

const mealIcons = {
  "Breakfast": "🌅",
  "Mid-Morning Snack": "🍎",
  "Lunch": "🍛",
  "Evening Snack": "☕",
  "Dinner": "🌙",
};

export default function MealPlan({ plan }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="meal-card text-center">
          <p className="text-2xl font-bold text-saffron">{plan.daily_calories}</p>
          <p className="text-xs text-gray-500 mt-1">Total Calories</p>
        </div>
        <div className="meal-card text-center">
          <p className="text-2xl font-bold text-leaf">{plan.meals.length}</p>
          <p className="text-xs text-gray-500 mt-1">Meals Today</p>
        </div>
        <div className="meal-card text-center">
          <p className="text-2xl font-bold text-blue-500">{plan.water_goal_liters}L</p>
          <p className="text-xs text-gray-500 mt-1">Water Goal</p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
        <p className="text-sm text-orange-700">💡 <strong>Coach's Tip:</strong> {plan.tip}</p>
      </div>

      <div className="space-y-4">
        {plan.meals.map((meal, i) => (
          <div key={i} className="meal-card">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mealIcons[meal.type] || "🍽️"}</span>
                <div>
                  <p className="font-semibold text-gray-800">{meal.name}</p>
                  <p className="text-xs text-gray-400">{meal.type} · {meal.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-saffron">{meal.calories} kcal</p>
                <p className="text-xs text-gray-400">P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fat}g</p>
              </div>
            </div>

            {expanded === i && (
              <div className="mt-4 pt-4 border-t border-orange-100">
                <p className="text-sm font-semibold text-gray-600 mb-2">🛒 Ingredients</p>
                <ul className="flex flex-wrap gap-2 mb-3">
                  {meal.ingredients?.map((ing, j) => (
                    <span key={j} className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full">{ing}</span>
                  ))}
                </ul>
                <p className="text-sm font-semibold text-gray-600 mb-1">👨‍🍳 Recipe</p>
                <p className="text-sm text-gray-600 leading-relaxed">{meal.recipe}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}