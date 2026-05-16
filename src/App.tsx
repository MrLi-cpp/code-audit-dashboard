import { Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ExamplesPage from "@/pages/ExamplesPage";
import SecurityPage from "@/pages/SecurityPage";
import SecurityExamplesPage from "@/pages/SecurityExamplesPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/security-examples" element={<SecurityExamplesPage />} />
      </Routes>
    </Layout>
  );
}
