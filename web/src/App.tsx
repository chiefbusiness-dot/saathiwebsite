import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { StyleGuide } from "./pages/StyleGuide";
import { ComingSoon } from "./pages/ComingSoon";

const upcoming = [
  { path: "how-it-works", title: "How it works", lede: "The watch and the response team, step by step." },
  { path: "care-plan", title: "The care plan", lede: "A real person on the other end of every alert, and a call every day." },
  { path: "pricing", title: "Pricing", lede: "Buy the watch once. Add care if you want it." },
  { path: "our-story", title: "Our story", lede: "Built in Dehradun, for our own grandparents first." },
  { path: "faq", title: "Questions", lede: "Charging, signal, privacy and everything else families ask." },
  { path: "app-preview", title: "The family app", lede: "A preview of what you will see on your phone." },
  { path: "join", title: "Join the pilot", lede: "We are starting with 20 families. The sign-up form opens here shortly." },
  { path: "contact", title: "Contact", lede: "Talk to the people building Saathi." },
  { path: "privacy", title: "Privacy", lede: "What we collect, and what we never do with it." },
  { path: "terms", title: "Terms", lede: "What Saathi does, and what it does not promise." },
];

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="style-guide" element={<StyleGuide />} />
        {upcoming.map((p) => (
          <Route key={p.path} path={p.path} element={<ComingSoon title={p.title} lede={p.lede} />} />
        ))}
        <Route path="*" element={<ComingSoon title="Page not found" lede="That page doesn't exist." />} />
      </Route>
    </Routes>
  );
}
