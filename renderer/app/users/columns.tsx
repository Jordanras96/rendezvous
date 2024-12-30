"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  deleteUser,
  deleteMultipleUsers,
  updateUser,
} from "@/app/api/index"; // Importez les fonctions axios

export type User = {
  id: string;
  username: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  // Colonne de sélection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Colonne Nom d'utilisateur
  {
    accessorKey: "username",
    header: "Nom d'utilisateur",
  },
  // Colonne Rôle
  {
    accessorKey: "role",
    header: "Rôle",
  },
  // Colonne Actions
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const { toast } = useToast();
      const router = useRouter();

      // Supprimer un utilisateur
      const handleDelete = async () => {
        try {
          await deleteUser(user.id);
          toast({
            title: "Succès",
            description: `L'utilisateur ${user.username} a été supprimé.`,
            variant: "default",
          });
          router.refresh(); // Rafraîchir la page
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la suppression.",
            variant: "destructive",
          });
        }
      };

      // Modifier un utilisateur
      const handleEdit = async () => {
        // Ouvrir un Dialog pour modifier l'utilisateur
        // Vous pouvez utiliser un composant Dialog ou une modale personnalisée
        // Exemple : ouvrir un formulaire pré-rempli avec les données de l'utilisateur
        const newUsername = prompt("Entrez le nouveau nom d'utilisateur", user.username);
        const newRole = prompt("Entrez le nouveau rôle", user.role);

        if (newUsername && newRole) {
          try {
            await updateUser(user.id, { username: newUsername, role: newRole });
            toast({
              title: "Succès",
              description: `L'utilisateur ${user.username} a été mis à jour.`,
              variant: "default",
            });
            router.refresh(); // Rafraîchir la page
          } catch (error) {
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de la mise à jour.",
              variant: "destructive",
            });
          }
        }
      };

      // Supprimer plusieurs utilisateurs
      const handleDeleteMultiple = async () => {
        const selectedIds = table
          .getSelectedRowModel()
          .rows.map((row) => row.original.id);

        if (selectedIds.length === 0) {
          toast({
            title: "Aucun utilisateur sélectionné",
            description: "Veuillez sélectionner au moins un utilisateur à supprimer.",
            variant: "destructive",
          });
          return;
        }

        try {
          await deleteMultipleUsers(selectedIds);
          toast({
            title: "Succès",
            description: `Les utilisateurs sélectionnés ont été supprimés.`,
            variant: "default",
          });
          router.refresh(); // Rafraîchir la page
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la suppression multiple.",
            variant: "destructive",
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Supprimer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteMultiple}>
              Supprimer les utilisateurs sélectionnés
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];