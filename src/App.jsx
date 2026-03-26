import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import MealPlanPage from "./pages/MealPlanPage";

export default function App() {
  const profile = localStorage.getItem("userProfile");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={profile ? <Navigate to="/mealplan" /> : <OnboardingPage />} />
        <Route path="/mealplan" element={<MealPlanPage />} />
      </Routes>
    </BrowserRouter>
  );
}