import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import Store from "@/store/store";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./lib/theme-provider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  </Provider>,
);
