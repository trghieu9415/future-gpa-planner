import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import { Scheduler } from "./pages/scheduler/Scheduler";
import { GpaCalculator } from "./pages/gpa-calculator/GpaCalculator";

const App = () => (
  <TooltipProvider>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={"/calculator"} />} />
          <Route path="calculator" element={<GpaCalculator />} />
          <Route path="scheduler" element={<Scheduler />} />
        </Route>

        <Route path="*" element={<Navigate to={"/scheduler"} />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
