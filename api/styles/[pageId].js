// Vercel Serverless Function - Get Styles by PageId
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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { pageId } = req.query;
    
    const { data, error } = await supabase
      .from('page_styles')
      .select('css')
      .eq('page_id', pageId)
      .single();
    
    if (error) {
      return res.status(404).json({ success: false, message: 'Estilos não encontrados' });
    }
    
    res.status(200).json({ success: true, css: data.css });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
