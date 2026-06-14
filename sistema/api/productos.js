import { createClient } from '@supabase/supabase-js';
import { verifyAuth } from "./_auth.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (!auth) return res.status(401).json({ error: "No autorizado" });

  try {
    if (req.method === "GET") {
      const { data: productos, error } = await supabase
        .from('Producto')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      return res.status(200).json(productos);
    }
    
    if (req.method === "POST") {
      const { nombre, marca, categoria, descripcion, caracteristicas, imagen, price } = req.body;
      if (!nombre || !categoria || !price) {
        return res.status(400).json({ error: "Campos requeridos: nombre, categoria, price" });
      }
      
      const { data: nuevo, error } = await supabase
        .from('Producto')
        .insert([{ 
          nombre, 
          marca: marca || "", 
          categoria, 
          descripcion: descripcion || "", 
          caracteristicas: caracteristicas || [], 
          imagen: imagen || "", 
          price 
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(nuevo);
    }
    
    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Error interno de Supabase" });
  }
}
