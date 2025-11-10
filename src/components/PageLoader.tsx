import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PageLoaderProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export default function PageLoader({ loading, error, children }: PageLoaderProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FAF9F7] to-[#F5F3F0]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#B8860B] mx-auto mb-4" />
          <p className="text-lg text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FAF9F7] to-[#F5F3F0] p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Página</AlertTitle>
          <AlertDescription>
            {error}
            <br />
            <br />
            Por favor, tente recarregar a página ou entre em contato se o problema persistir.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
