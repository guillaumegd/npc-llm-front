import { useEffect } from 'react'
import './App.css'
import ChatContainer from './components/ChatContainer'
import { ThemeProvider, useTheme } from './context/ThemeContext'

// Importation des styles de base
import './styles/ChatContainer.css'
import './styles/ChatInput.css'

// Composant principal qui utilise le contexte de thème
const AppContent = () => {
  const { currentTheme, toggleTheme } = useTheme();

  // Effet pour charger le CSS du thème actuel
  useEffect(() => {
    // Suppression de tous les liens de thèmes précédents
    const oldThemeLink = document.getElementById('theme-css');
    if (oldThemeLink) {
      oldThemeLink.remove();
    }

    // Création et ajout du nouveau lien de thème
    const link = document.createElement('link');
    link.id = 'theme-css';
    link.rel = 'stylesheet';
    link.href = `./src/styles/themes/${currentTheme}.css`;
    document.head.appendChild(link);
  }, [currentTheme]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Bouton de changement de thème */}
      <button
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
        Changer de thème ({currentTheme})
      </button>
      
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

// Fonction App avec ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
