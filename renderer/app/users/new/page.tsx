'use client'
import { Button } from '@/components/ui/button'
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
import { createUser } from '@/app/api/index' // Importez la fonction createUser

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

export default function NewUserPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
      role: 'USER'
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      // Utilisez la fonction createUser pour créer l'utilisateur
      const newUser = await createUser(data)

      toast({
        title: 'Utilisateur créé avec succès',
        description: `L'utilisateur ${newUser.username} a été créé.`,
        variant: 'default'
      })

      router.push('/users') // Redirection vers la liste des utilisateurs
      router.refresh() // Rafraîchit les données
    } catch (error) {
      console.error('Erreur :', error)

      // Afficher un toast d'erreur spécifique si le nom d'utilisateur existe déjà
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Le nom d'utilisateur existe déjà"
      ) {
        toast({
          title: 'Erreur',
          description:
            "Le nom d'utilisateur existe déjà. Veuillez en choisir un autre.",
          variant: 'destructive'
        })
      } else {
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Créer un nouvel utilisateur</h1>
        <Link href="/users">
          <Button variant="outline">Retour</Button>
        </Link>
      </div>

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

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : "Créer l'utilisateur"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}>
              Réinitialiser
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
