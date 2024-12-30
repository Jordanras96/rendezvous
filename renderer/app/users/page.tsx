'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { getUsers, deleteUser, deleteMultipleUsers } from '@/app/api/users'
import { Filter, PencilIcon, Trash2Icon, X } from 'lucide-react'
import EditUserDialog from '@/components/EditUserForm'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const [usernameFilter, setUsernameFilter] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Récupérer la liste des utilisateurs
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
      console.error('Erreur lors de la récupération des utilisateurs', error)
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

  // Gérer la sélection/désélection d'un utilisateur
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // Supprimer un utilisateur
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

  // Supprimer plusieurs utilisateurs
  const handleDeleteMultipleUsers = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'Aucun utilisateur sélectionné',
        description:
          'Veuillez sélectionner au moins un utilisateur à supprimer.',
        variant: 'destructive'
      })
      return
    }

    try {
      // Trouver les utilisateurs sélectionnés avant de les supprimer pour obtenir leurs noms
      const usersToDelete = users.filter(user =>
        selectedUsers.includes(user.id)
      )
      const usernames = usersToDelete.map(user => user.username).join(', ')

      // Supprimer les utilisateurs sélectionnés
      await deleteMultipleUsers(selectedUsers)

      // Mettre à jour la liste des utilisateurs
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
      setIsDeleteDialogOpen(false)

      // Afficher un toast avec les noms des utilisateurs supprimés
      toast({
        title: 'Succès',
        description: `Les utilisateurs suivants ont été supprimés avec succès : ${usernames}`,
        variant: 'default'
      })
    } catch (error) {
      console.error('Erreur lors de la suppression des utilisateurs', error)
      toast({
        title: 'Erreur',
        description:
          'Une erreur est survenue lors de la suppression des utilisateurs.',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des Utilisateurs</h1>
        <div className="flex gap-4">
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={selectedUsers.length === 0}>
                Supprimer les utilisateurs sélectionnés
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer les utilisateurs
                  sélectionnés ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteMultipleUsers}>
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => router.push('/users/new')}>
            Créer un nouvel utilisateur
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Filtrer par nom d'utilisateur"
          value={usernameFilter}
          onChange={e => setUsernameFilter(e.target.value)}
        />
        <Select
          value={roleFilter}
          onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={<Filter size={20} />} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="DOCTOR">Médecin</SelectItem>
            <SelectItem value="NURSE">Infirmier(e)</SelectItem>
            <SelectItem value="USER">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé.</p>
        ) : (
          users.map(user => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleSelectUser(user.id)}
                />
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.key[0]?.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <EditUserDialog
                  user={user}
                  onUpdate={fetchUsers}
                />{' '}
                {/* Ajoutez le Dialog ici */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}>
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}>
            Précédent
          </Button>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}>
            Suivant
          </Button>
        </div>
        <p>
          Page {page} sur {totalPages}
        </p>
      </div>
    </div>
  )
}
