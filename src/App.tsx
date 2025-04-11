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
  const { currentTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Effect to apply CSS classes for the current theme
  useEffect(() => {
    // Mark the component as mounted
    setMounted(true);
    
    // Remove all theme classes from the body
    document.body.classList.remove('theme-medieval', 'theme-futuristic');
    
    // Add the class corresponding to the current theme
    document.body.classList.add(`theme-${currentTheme}`);
    
  }, [currentTheme]);

  if (!mounted) return null; // Avoid server-side rendering to prevent inconsistencies

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Theme toggle button */}
      {/* <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 100,
          padding: '5px 10px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Change Theme ({currentTheme})
      </button> */}
      
      <div style={{ 
        flex: 1,
        overflow: 'hidden',
        display: 'flex'
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
