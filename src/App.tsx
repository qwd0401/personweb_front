import { BrowserRouter, useRoutes } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme, darkTheme } from "./themes/theme";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import routes from "./routes";
import "./i18n";

// 创建一个 QueryClient 实例
const queryClient = new QueryClient();

const AppContent = () => {
  const { mode } = useTheme();
  const element = useRoutes(routes);

  return (
    <MuiThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      {element}
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
