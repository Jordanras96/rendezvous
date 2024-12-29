import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Création d'un utilisateur
app.post('/api/users', async (req: Request, res: Response): Promise<Response> => {
    const { username, password, role } = req.body;

    try {
      // Vérifier si le nom d'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
  
      if (existingUser) {
        return res.status(400).json({ error: "Le nom d'utilisateur existe déjà" });
      }
  
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Créer l'utilisateur et la clé associée
      const user = await prisma.user.create({
        data: {
          username,
          key: {
            create: {
              hashed_password: hashedPassword,
              role: role as Role,
            },
          },
        },
        include: {
          key: true,
        },
      });
  
      res.json(user);
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur", error);
      res.status(400).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
  });

    // Liste des utilisateurs
    app.get('/api/users', async (req: Request, res: Response) => {
      const { page = 1, limit = 10, role, username } = req.query;
    
      try {
        // Construire l'objet `where` pour le filtrage
        const where: any = {};
        if (role) {
          where.key = {
            some: {
              role: role, // Filtre par rôle dans le modèle Key
            },
          };
        }
        if (username) {
          where.username = { contains: username, mode: 'insensitive' }; // Filtre par nom d'utilisateur
        }
    
        // Récupérer les utilisateurs avec pagination et filtrage
        const users = await prisma.user.findMany({
          where,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          include: {
            key: true, // Inclure les clés associées
          },
        });
    
        // Compter le nombre total d'utilisateurs correspondant aux filtres
        const totalUsers = await prisma.user.count({ where });
    
        // Renvoyer la réponse
        res.json({
          users,
          total: totalUsers,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalUsers / Number(limit)),
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
      }
    });

      // Modification d'un utilisateur
      app.put('/api/users/:id', async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { username, password, role } = req.body;
      
        try {
          // Vérifier si l'utilisateur existe
          const userExists = await prisma.user.findUnique({
            where: { id },
            include: { key: true },
          });
      
          if (!userExists) {
            res.status(404).json({ error: "Utilisateur non trouvé" });
            return; // Arrêter l'exécution de la fonction
          }
      
          // Préparer les données de mise à jour
          let updateData: any = { username };
      
          if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
      
            // Vérifier si l'utilisateur a une clé associée
            if (!userExists.key || userExists.key.length === 0) {
              res.status(400).json({ error: "Aucune clé associée à cet utilisateur" });
              return; // Arrêter l'exécution de la fonction
            }
      
            // Mettre à jour la clé associée
            const keyId = userExists.key[0].id; // Prendre l'ID de la première clé
            updateData.key = {
              update: {
                where: { id: keyId }, // Spécifier l'ID de la clé à mettre à jour
                data: {
                  hashed_password: hashedPassword,
                  role: role as Role,
                },
              },
            };
          }
      
          // Mettre à jour l'utilisateur
          const user = await prisma.user.update({
            where: { id },
            data: updateData,
            include: {
              key: true,
            },
          });
      
          res.json(user); // Envoyer la réponse
        } catch (error) {
          console.error("Erreur détaillée :", error);
          res.status(400).json({error});
        }
      });

      // Suppression d'un utilisateur
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.user.delete({
        where: { id },
      });
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  });
  
  // Suppression de plusieurs utilisateurs
  app.delete('/api/users', async (req, res) => {
    const { ids } = req.body;
  
    try {
      await prisma.user.deleteMany({
        where: { id: { in: ids } },
      });
      res.json({ message: 'Utilisateurs supprimés avec succès' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Erreur lors de la suppression des utilisateurs" });
    }
  });
  
  // Démarrer le serveur
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
  });