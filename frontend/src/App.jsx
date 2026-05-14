import { Toaster } from 'react-hot-toast';
import Loader from './components/layout/Loader';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <>
      <Loader />
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F2A2E',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255, 61, 168, 0.25)',
          },
          success: { iconTheme: { primary: '#FF3DA8', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </>
  );
}
