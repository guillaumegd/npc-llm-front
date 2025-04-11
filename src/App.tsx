import { useEffect, useState } from 'react'
import './App.css'
import ChatContainer from './components/ChatContainer'
import { ThemeProvider, useTheme } from './context/ThemeContext'

// Importation des styles de base
import './styles/ChatContainer.css'
import './styles/ChatInput.css'

// Import dynamique des styles de thème
import './styles/themes/medieval.css'
import './styles/themes/futuristic.css'

// Composant principal qui utilise le contexte de thème
const AppContent = () => {
  const { currentTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Effet pour appliquer les classes CSS du thème actuel
  useEffect(() => {
    // Marquer le composant comme monté
    setMounted(true);
    
    // Supprimer toutes les classes de thème du body
    document.body.classList.remove('theme-medieval', 'theme-futuristic');
    
    // Ajouter la classe correspondant au thème actuel
    document.body.classList.add(`theme-${currentTheme}`);
    
  }, [currentTheme]);

  if (!mounted) return null; // Éviter le rendu côté serveur pour prévenir les incohérences

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
