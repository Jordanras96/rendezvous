'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/app/api/index' // Importez la fonction de mise à jour
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from './ui/label'
import { Pencil } from 'lucide-react'

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères."
  }),
  password: z.string().optional(), // Le mot de passe est optionnel
  role: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'USER'], {
    required_error: 'Veuillez sélectionner un rôle.'
  })
})

type FormData = z.infer<typeof FormSchema>

export default function EditUserDialog({
  user,
  onUpdate
}: {
  user: any
  onUpdate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: user.username,
      password: '',
      role: user.key[0].role
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      await updateUser(user.id, {
        username: data.username,
        password: data.password,
        role: data.role // Assurez-vous que le rôle est inclus
      })
      toast({
        title: 'Utilisateur mis à jour avec succès',
        description: `L'utilisateur ${data.username} a été mis à jour.`,
        variant: 'default'
      })
      setIsOpen(false) // Fermer le dialog après la mise à jour
      onUpdate() // Rafraîchir la liste des utilisateurs
    } catch (error) {
      console.error('Erreur :', error)
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez le nom d'utilisateur"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mot de passe (laisser vide pour ne pas changer)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Entrez le nouveau mot de passe"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="DOCTOR">Médecin</SelectItem>
                      <SelectItem value="NURSE">Infirmier(e)</SelectItem>
                      <SelectItem value="USER">Utilisateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>
                    Le rôle détermine les permissions de l'utilisateur.
                  </Label>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}>
                {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}>
                Annuler
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
