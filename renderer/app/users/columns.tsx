import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { deleteUser, getUsers } from '../api'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import EditUserDialog from '@/components/EditUserForm'

export type User = {
  id: string
  username: string
  role: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: "Nom d'utilisateur"
  },
  {
    accessorKey: 'role',
    header: 'Rôle'
  },
  {
    accessorKey: 'createdAt',
    header: 'Date de création',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString()
  },
  {
    accessorKey: 'updatedAt',
    header: 'Date de mise à jour',
    cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleDateString()
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [users, setUsers] = useState([])
      const { toast } = useToast()
      const [page, setPage] = useState(1)
      const [limit, setLimit] = useState(10)
      const [roleFilter, setRoleFilter] = useState('')
      const [usernameFilter, setUsernameFilter] = useState('')
      const [totalPages, setTotalPages] = useState(1)
      const [isLoading, setIsLoading] = useState(true)

      const fetchUsers = async () => {
        try {
          const response = await getUsers({
            page,
            limit,
            role: roleFilter === 'ALL' ? undefined : roleFilter,
            username: usernameFilter
          })
          setUsers(response.users)
          setTotalPages(response.totalPages)
        } catch (error) {
          console.error(
            'Erreur lors de la récupération des utilisateurs',
            error
          )
          toast({
            title: 'Erreur',
            description:
              'Une erreur est survenue lors de la récupération des utilisateurs.',
            variant: 'destructive'
          })
        } finally {
          setIsLoading(false)
        }
      }

      useEffect(() => {
        fetchUsers()
      }, [page, limit, roleFilter, usernameFilter])

      const handleDeleteUser = async (userId: string) => {
        try {
          // Trouver l'utilisateur avant de le supprimer pour obtenir son nom
          const userToDelete = users.find(user => user.id === userId)
          if (!userToDelete) {
            throw new Error('Utilisateur non trouvé')
          }

          // Supprimer l'utilisateur
          await deleteUser(userId)

          // Mettre à jour la liste des utilisateurs
          setUsers(prev => prev.filter(user => user.id !== userId))

          // Afficher un toast avec le nom de l'utilisateur supprimé
          toast({
            title: 'Succès',
            description: `L'utilisateur "${userToDelete.username}" a été supprimé avec succès.`,
            variant: 'default'
          })
        } catch (error) {
          console.error("Erreur lors de la suppression de l'utilisateur", error)
          toast({
            title: 'Erreur',
            description:
              "Une erreur est survenue lors de la suppression de l'utilisateur.",
            variant: 'destructive'
          })
        }
      }
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (
              //   handleEditUser(row.original.id)
              <EditUserDialog
                user={row.original.id}
                onUpdate={fetchUsers}
              />
            )}>
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteUser(row.original.id)}>
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  }
]
