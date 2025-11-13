import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileJson, Eye } from 'lucide-react';
import VisualPageEditor from '@/components/VisualPageEditor';
import BlogEditor from '@/components/BlogEditor';
import Index from './Index';
import { API_ENDPOINTS } from '@/config/api';
import QuemSomos from './QuemSomos';
import Contato from './Contato';
import Purificacao from './Purificacao';
import Artigos from './Artigos';
import Testemunhos from './Testemunhos';
import Tratamentos from './Tratamentos';

export default function AdminConsole() {
  const pages = [
    { id: 'index', name: 'Homepage', component: Index },
    { id: 'quemsomos', name: 'Quem Somos', component: QuemSomos },
    { id: 'contato', name: 'Contato', component: Contato },
    { id: 'purificacao', name: 'Purificação', component: Purificacao },
    { id: 'artigos', name: 'Artigos', component: Artigos },
    { id: 'testemunhos', name: 'Testemunhos', component: Testemunhos },
    { id: 'tratamentos', name: 'Tratamentos', component: Tratamentos },
  ];

  const [pageContents, setPageContents] = useState<Record<string, unknown>>({});
  const [loadingContents, setLoadingContents] = useState(true);
  const [editorMode, setEditorMode] = useState<'visual' | 'json'>(() => {
    return (localStorage.getItem('adminConsole_editorMode') as 'visual' | 'json') || 'visual';
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminConsole_activeTab') || 'pages';
  });
  const [pageTab, setPageTab] = useState(() => {
    return localStorage.getItem('adminConsole_pageTab') || 'index';
  });
  const [jsonTab, setJsonTab] = useState(() => {
    return localStorage.getItem('adminConsole_jsonTab') || 'index';
  });
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Carregar conteúdos via API
  useEffect(() => {
    const loadAllContents = async () => {
      const contents: Record<string, unknown> = {};
      const editedContents: Record<string, string> = {};
      
      for (const page of pages) {
        try {
          const response = await fetch(API_ENDPOINTS.getContent(page.id));
          if (response.ok) {
            const data = await response.json();
            contents[page.id] = data.content || {};
            editedContents[page.id] = JSON.stringify(data.content || {}, null, 2);
          }
        } catch (error) {
          console.error(`Failed to load ${page.id}:`, error);
          contents[page.id] = {};
          editedContents[page.id] = '{}';
        }
      }
      
      setPageContents(contents);
      setEditedContent(editedContents);
      setLoadingContents(false);
    };
    
    loadAllContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salvar todos os estados de abas no localStorage
  useEffect(() => {
    localStorage.setItem('adminConsole_editorMode', editorMode);
  }, [editorMode]);

  useEffect(() => {
    localStorage.setItem('adminConsole_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('adminConsole_pageTab', pageTab);
  }, [pageTab]);

  useEffect(() => {
    localStorage.setItem('adminConsole_jsonTab', jsonTab);
  }, [jsonTab]);

  useEffect(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('visual_') || key.startsWith('admin_') || key.startsWith('wysiwyg_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, []);

  const handleSave = async (pageId: string) => {
    try {
      const content = editedContent[pageId];
      JSON.parse(content);
      
      const response = await fetch(API_ENDPOINTS.saveJson, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: pageId,
          content: JSON.parse(content)
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar');
      
      setMessage({ type: 'success', text: `Salvo: ${pages.find(p => p.id === pageId)?.name}` });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: `Erro: ${error}` });
    }
  };

  const handleDownload = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    
    const blob = new Blob([editedContent[pageId]], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page.id}.json`;
    a.click();
  };

  if (loadingContents) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Carregando conteúdos da API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Console</h1>

            {message && (
              <Alert className="mb-4">
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as 'visual' | 'json')}>
              <TabsList>
                <TabsTrigger value="visual" className="min-w-[180px] px-6 py-3">
                  <Eye className="w-4 h-4 mr-2" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="json" className="min-w-[180px] px-6 py-3">
                  <FileJson className="w-4 h-4 mr-2" />
                  JSON
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visual">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="pages" className="min-w-40 px-6 py-2.5">Pages</TabsTrigger>
                    <TabsTrigger value="blog" className="min-w-40 px-6 py-2.5">Blog</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pages">
                    <Tabs value={pageTab} onValueChange={setPageTab}>
                      <TabsList className="flex-wrap">
                        {pages.map(page => (
                          <TabsTrigger key={page.id} value={page.id} className="min-w-[140px] px-5 py-2">{page.name}</TabsTrigger>
                        ))}
                      </TabsList>

                      {pages.map(page => (
                        <TabsContent key={page.id} value={page.id}>
                          <VisualPageEditor
                            pageId={page.id}
                            pageName={page.name}
                            pageComponent={page.component}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="blog">
                    <BlogEditor />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="json">
                <Tabs value={jsonTab} onValueChange={setJsonTab}>
                  <TabsList className="flex-wrap">
                    {pages.map(page => (
                      <TabsTrigger key={page.id} value={page.id} className="min-w-[140px] px-5 py-2">{page.name}</TabsTrigger>
                    ))}
                  </TabsList>

                  {pages.map(page => (
                    <TabsContent key={page.id} value={page.id}>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Button onClick={() => handleSave(page.id)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => handleDownload(page.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        
                        <Textarea
                          rows={30}
                          value={editedContent[page.id]}
                          onChange={(e) => setEditedContent(prev => ({ ...prev, [page.id]: e.target.value }))}
                          className="font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
