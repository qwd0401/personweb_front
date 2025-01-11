import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './themes/theme';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import routes from './routes';
import './i18n';

const AppContent = () => {
  const { mode } = useTheme();
  const element = useRoutes(routes);

  return (
    <MuiThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      {element}
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
