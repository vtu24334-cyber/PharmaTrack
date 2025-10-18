import { AppProvider } from '@/components/app-provider';

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}

