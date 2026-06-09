import { useEffect, useState } from 'react';
import Home from './pages/Home';
import { useFontStore } from './store/useFontStore';
import { useGoogleFonts } from './hooks/useGoogleFonts';
import { ApiKeyBanner, loadApiKey } from './components/Banner/ApiKeyBanner';

function App() {
  const init = useFontStore((s) => s.init);
  const [apiKey, setApiKey] = useState<string>(() => loadApiKey());
  const { loading } = useGoogleFonts(apiKey || undefined);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <ApiKeyBanner apiKey={apiKey} onKeyChange={setApiKey} />
      <div className="min-h-0 flex-1 overflow-hidden">
        <Home fontsLoading={loading} />
      </div>
    </div>
  );
}

export default App;
