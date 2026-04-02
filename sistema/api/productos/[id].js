import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "../_auth.js";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (!auth) return res.status(401).json({ error: "No autorizado" });
  
  const id = parseInt(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  
  try {
    if (req.method === "PUT") {
      const { nombre, marca, categoria, descripcion, caracteristicas, imagen, price } = req.body;
      const updated = await prisma.producto.update({ 
        where: { id }, 
        data: { nombre, marca, categoria, descripcion, caracteristicas, imagen, price } 
      });
      return res.status(200).json(updated);
    }
    
    if (req.method === "DELETE") {
      await prisma.producto.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }
    
    return res.status(405).end();
  } catch (e) {
    if (e.code === "P2025") return res.status(404).json({ error: "Producto no encontrado" });
    console.error(e);
    return res.status(500).json({ error: e.message || "Error interno de servidor" });
  } finally { 
    await prisma.$disconnect(); 
  }
}
