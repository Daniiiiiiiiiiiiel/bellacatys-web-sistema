// api/productos.js – Endpoint público: GET /api/productos
// Usa Supabase JS (HTTPS) en lugar de Prisma directo para evitar bloqueo de puerto 5432

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  try {
    const { data: productos, error } = await supabase
      .from('Producto')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error interno del servidor', detail: error.message });
  }
}
