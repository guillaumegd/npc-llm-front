import { useEffect, useState } from 'react'
import './App.css'
import ChatContainer from './components/ChatContainer'
import { ThemeProvider, useTheme } from './context/ThemeContext'

// Import basic styles
import './styles/ChatContainer.css'
import './styles/ChatInput.css'

// Dynamic import of theme styles
import './styles/themes/medieval.css'
import './styles/themes/futuristic.css'

// Main component that uses the theme context
const AppContent = () => {
  const { currentTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Effect to apply CSS classes for the current theme
  useEffect(() => {
    // Mark the component as mounted
    setMounted(true);
    
    // Remove all theme classes from the body
    document.body.classList.remove('theme-medieval', 'theme-futuristic');
    
    // Add the class corresponding to the current theme
    document.body.classList.add(`theme-${currentTheme}`);
    
    // Add meta viewport tag for responsive design if it doesn't exist
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [currentTheme]);

  if (!mounted) return null; // Avoid server-side rendering to prevent inconsistencies

  return (
    <div className="app-container" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div className="app-content" style={{ 
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        width: '100%'
      }}>
        <ChatContainer />
      </div>
    </div>
  );
};

// App function with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
