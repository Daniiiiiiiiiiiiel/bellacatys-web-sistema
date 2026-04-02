import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "./_auth.js";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (!auth) return res.status(401).json({ error: "No autorizado" });

  try {
    if (req.method === "GET") {
      const productos = await prisma.producto.findMany({ orderBy: { id: "asc" } });
      return res.status(200).json(productos);
    }
    
    if (req.method === "POST") {
      const { nombre, marca, categoria, descripcion, caracteristicas, imagen, price } = req.body;
      if (!nombre || !categoria || !price) {
        return res.status(400).json({ error: "Campos requeridos: nombre, categoria, price" });
      }
      
      const nuevo = await prisma.producto.create({ 
        data: { 
          nombre, 
          marca: marca || "", 
          categoria, 
          descripcion: descripcion || "", 
          caracteristicas: caracteristicas || [], 
          imagen: imagen || "", 
          price 
        } 
      });
      return res.status(201).json(nuevo);
    }
    
    return res.status(405).end();
  } finally { 
    await prisma.$disconnect(); 
  }
}
