import { createClient } from '@supabase/supabase-js';
import { verifyAuth } from "../_auth.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (!auth) return res.status(401).json({ error: "No autorizado" });
  
  const id = parseInt(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  
  try {
    if (req.method === "PUT") {
      const { nombre, marca, categoria, descripcion, caracteristicas, imagen, price } = req.body;
      const { data: updated, error } = await supabase
        .from('Producto')
        .update({ nombre, marca, categoria, descripcion, caracteristicas, imagen, price })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === "P2025" || error.code === "23503") return res.status(404).json({ error: "Producto no encontrado" });
        throw error;
      }
      return res.status(200).json(updated);
    }
    
    if (req.method === "DELETE") {
      const { error } = await supabase
        .from('Producto')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    return res.status(405).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || "Error interno de servidor" });
  }
}
