import { verifyAuth } from './_auth.js';
import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Vercel by default limits the request body. We need to disable the default body parser to use formidable.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const auth = await verifyAuth(req);
  if (!auth) return res.status(401).json({ error: 'No autorizado' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error al procesar archivo' });
    
    // In formidable v3, files.file might be an array
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) return res.status(400).json({ error: 'No se envió ningún archivo' });

    try {
      const fileExt = file.originalFilename.split('.').pop() || 'png';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      const fileData = fs.readFileSync(file.filepath);

      const { data, error } = await supabase.storage
        .from('productos')
        .upload(filePath, fileData, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      return res.status(200).json({ ok: true, url: publicUrl });
    } catch (e) {
      console.error('Error supabase upload:', e);
      return res.status(500).json({ error: 'Error al subir a Supabase' });
    }
  });
}
