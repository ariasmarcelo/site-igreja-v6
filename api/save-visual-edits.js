// Vercel Serverless Function - Save Visual Edits
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { pageId, updates } = req.body;
    
    // Buscar conteúdo atual do Supabase
    const { data, error: fetchError } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ success: false, message: 'Página não encontrada' });
    }
    
    const content = data.content;
    
    // Aplicar updates
    updates.forEach(({ key, value }) => {
      const keys = key.split('.');
      let current = content;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
    });
    
    // Salvar de volta no Supabase
    const { error: updateError } = await supabase
      .from('page_contents')
      .upsert({
        page_id: pageId,
        content,
        updated_at: new Date().toISOString()
      });
    
    if (updateError) throw updateError;
    
    res.status(200).json({ success: true, message: 'Edições salvas com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
