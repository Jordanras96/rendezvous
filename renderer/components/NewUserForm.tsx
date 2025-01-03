'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
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
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { createUser, checkUsername } from '@/app/api/index' // Importez la fonction createUser
import debounce from 'lodash.debounce'
import { PlusIcon } from 'lucide-react'

// Définition du schéma de validation avec les rôles du schema Prisma
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères."
  }),
  password: z.string().min(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.'
  }),
  role: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'USER'], {
    required_error: 'Veuillez sélectionner un rôle.'
  })
})

type FormData = z.infer<typeof FormSchema> & {
  username: string // Assurez-vous que ces propriétés sont requises
  password: string
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'USER'
}

interface NewUserPageProps {
  onUserCreated?: () => void // Ajoutez cette prop
}

export default function NewUserPage({ onUserCreated }: NewUserPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usernameExists, setUsernameExists] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
      role: 'USER'
    }
  })

  // Vérifier si le nom d'utilisateur existe déjà
  const handleCheckUsername = async (username: string) => {
    if (username.length >= 2) {
      try {
        const exists = await checkUsername(username)
        setUsernameExists(exists)
      } catch (error) {
        console.error(
          "Erreur lors de la vérification du nom d'utilisateur",
          error
        )
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    if (usernameExists) {
      toast({
        title: 'Erreur',
        description:
          "Le nom d'utilisateur existe déjà. Veuillez en choisir un autre.",
        variant: 'destructive'
      })
      return
    }

    try {
      setIsSubmitting(true)
      const newUser = await createUser(data)
      toast({
        title: 'Utilisateur créé avec succès',
        description: `L'utilisateur ${newUser.username} a été créé.`,
        variant: 'default'
      })

      // Appeler la fonction onUserCreated si elle est définie
      if (onUserCreated) {
        onUserCreated()
      }

      router.push('/users')
      router.refresh()
    } catch (error) {
      console.error('Erreur :', error)

      if (error.response && error.response.data) {
        // Afficher un message d'erreur spécifique de l'API
        toast({
          title: 'Erreur',
          description: error.response.data.error || 'Une erreur est survenue',
          variant: 'destructive'
        })
      } else {
        // Afficher un message d'erreur générique
        toast({
          title: 'Erreur',
          description:
            error instanceof Error ? error.message : 'Une erreur est survenue',
          variant: 'destructive'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Nouvel utilisateur
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 md:w-2/3">
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
                        onBlur={e => handleCheckUsername(e.target.value)} // Déclencher la vérification lors du onBlur
                      />
                    </FormControl>
                    {usernameExists && (
                      <p className="text-sm text-red-500">
                        Ce nom d'utilisateur existe déjà.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Entrez le mot de passe"
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
                    <FormDescription>
                      Le rôle détermine les permissions de l'utilisateur.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting || usernameExists}>
                  {isSubmitting ? 'Création...' : "Créer l'utilisateur"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}>
                  Réinitialiser
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
