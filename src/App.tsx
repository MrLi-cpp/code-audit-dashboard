import { Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ExamplesPage from "@/pages/ExamplesPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/examples" element={<ExamplesPage />} />
      </Routes>
    </Layout>
  );
}
