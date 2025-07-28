import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import { GPACalculator } from "./pages/GPACalculator";
import { Scheduler } from "./pages/Scheduler";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to={"/calculator"} />} />
            <Route path="calculator" element={<GPACalculator />} />
            {/* <Route path="improvement" element={<Improvement />} /> */}
            <Route path="scheduler" element={<Scheduler />} />
          </Route>

          <Route path="*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
