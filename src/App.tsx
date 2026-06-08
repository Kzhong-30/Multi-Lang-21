import { useEffect } from 'react';
import Home from './pages/Home';
import { useFontStore } from './store/useFontStore';
import { useGoogleFonts } from './hooks/useGoogleFonts';

function App() {
  const init = useFontStore((s) => s.init);
  useGoogleFonts();

  useEffect(() => {
    init();
  }, [init]);

  return <Home />;
}

export default App;
