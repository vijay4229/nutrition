import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    id: "basics",
    title: "Tell us about yourself",
    fields: [
      { name: "name", label: "Your Name", type: "text", placeholder: "Rahul / Priya..." },
      { name: "age", label: "Age", type: "number", placeholder: "25" },
      { name: "weight", label: "Weight (kg)", type: "number", placeholder: "65" },
      { name: "height", label: "Height (cm)", type: "number", placeholder: "170" },
    ],
  },
  {
    id: "goal",
    title: "What's your health goal?",
    options: [
      { value: "weight_loss", label: "⚖️ Lose Weight" },
      { value: "muscle_gain", label: "💪 Gain Muscle" },
      { value: "diabetes", label: "🩺 Manage Diabetes" },
      { value: "pcos", label: "🌸 PCOS/PCOD" },
      { value: "general", label: "🌿 Stay Healthy" },
    ],
  },
  {
    id: "diet",
    title: "What do you eat?",
    options: [
      { value: "vegetarian", label: "🥦 Vegetarian" },
      { value: "vegan", label: "🌱 Vegan" },
      { value: "jain", label: "🕊️ Jain" },
      { value: "eggetarian", label: "🥚 Eggetarian" },
      { value: "non_veg", label: "🍗 Non-Vegetarian" },
    ],
  },
  {
    id: "region",
    title: "Your regional cuisine?",
    options: [
      { value: "north_indian", label: "🫓 North Indian" },
      { value: "south_indian", label: "🍛 South Indian" },
      { value: "gujarati", label: "🥜 Gujarati" },
      { value: "bengali", label: "🐟 Bengali" },
      { value: "marathi", label: "🌾 Marathi" },
      { value: "mixed", label: "🍽️ Mixed" },
    ],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({});

  const current = steps[step];

  function handleField(name, value) {
    setProfile((p) => ({ ...p, [name]: value }));
  }

  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      navigate("/mealplan");
    }
  }

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl text-saffron mb-1">AaharAI 🌿</h1>
        <p className="text-gray-500 text-sm">Your personal Indian nutrition coach</p>
      </div>

      <div className="h-2 bg-orange-100 rounded-full mb-6">
        <div className="h-2 bg-saffron rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="font-display text-xl mb-5 text-gray-800">{current.title}</h2>

      {current.fields && (
        <div className="space-y-4">
          {current.fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-gray-600 mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-saffron"
                onChange={(e) => handleField(f.name, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {current.options && (
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleField(current.id, opt.value)}
              className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                profile[current.id] === opt.value
                  ? "border-saffron bg-orange-50 text-saffron"
                  : "border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <button onClick={handleNext} className="btn-primary w-full mt-6">
        {step < steps.length - 1 ? "Next →" : "Generate My Meal Plan 🍽️"}
      </button>
      <p className="text-center text-xs text-gray-400 mt-3">Step {step + 1} of {steps.length}</p>
    </div>
  );
}