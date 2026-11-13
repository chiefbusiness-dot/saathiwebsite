import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
const HowItWorks = lazy(() => import("./pages/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const CarePlan = lazy(() => import("./pages/CarePlan").then((m) => ({ default: m.CarePlan })));
const PricingPage = lazy(() => import("./pages/PricingPage").then((m) => ({ default: m.PricingPage })));
const WhySaathi = lazy(() => import("./pages/WhySaathi").then((m) => ({ default: m.WhySaathi })));
const OurStory = lazy(() => import("./pages/OurStory").then((m) => ({ default: m.OurStory })));
const FaqPage = lazy(() => import("./pages/FaqPage").then((m) => ({ default: m.FaqPage })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Legal = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Legal })));
const StyleGuide = lazy(() => import("./pages/StyleGuide").then((m) => ({ default: m.StyleGuide })));
import { NotFound } from "./pages/NotFound";
const Join = lazy(() => import("./pages/Join").then((m) => ({ default: m.Join })));
const AppPreview = lazy(() => import("./pages/AppPreview").then((m) => ({ default: m.AppPreview })));
import { useSite } from "./site";

// Loaded only when /admin is opened, so visitors never download it.
const AdminApp = lazy(() => import("./admin/AdminApp"));

export function App() {
  const showPreview = useSite().settings.preview_visible;
  return (
    <Routes>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<div className="min-h-screen bg-mist" />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="care-plan" element={<CarePlan />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="why-saathi" element={<WhySaathi />} />
        <Route path="our-story" element={<OurStory />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Legal doc="privacy" />} />
        <Route path="terms" element={<Legal doc="terms" />} />
        <Route path="app-preview" element={showPreview ? <AppPreview /> : <NotFound />} />
        <Route path="join" element={<Join />} />
        <Route path="style-guide" element={<StyleGuide />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
