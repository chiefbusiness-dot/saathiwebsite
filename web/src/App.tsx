import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { HowItWorks } from "./pages/HowItWorks";
import { CarePlan } from "./pages/CarePlan";
import { PricingPage } from "./pages/PricingPage";
import { WhySaathi } from "./pages/WhySaathi";
import { OurStory } from "./pages/OurStory";
import { FaqPage } from "./pages/FaqPage";
import { Contact } from "./pages/Contact";
import { Legal } from "./pages/Legal";
import { StyleGuide } from "./pages/StyleGuide";
import { NotFound } from "./pages/NotFound";
import { Join } from "./pages/Join";
import { AppPreview } from "./pages/AppPreview";
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
