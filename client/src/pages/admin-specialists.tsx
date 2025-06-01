import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  Plus,
  Save,
  Trash2,
  Edit,
  UserPlus,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const specialistFormSchema = z.object({
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  speciality: z.string().min(3, "Especialidade é obrigatória"),
  bio: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SpecialistFormData = z.infer<typeof specialistFormSchema>;

export default function AdminSpecialists() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingSpecialist, setIsAddingSpecialist] = useState(false);

  const form = useForm<SpecialistFormData>({
    resolver: zodResolver(specialistFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      speciality: "",
      bio: "",
      isActive: true,
    },
  });

  const { data: specialists = [], isLoading } = useQuery({
    queryKey: ["/api/specialists"],
  });

  const createSpecialistMutation = useMutation({
    mutationFn: async (data: SpecialistFormData) => {
      return apiRequest("POST", "/api/specialists", {
        ...data,
        role: "specialist"
      });
    },
    onSuccess: () => {
      toast({
        title: "Especialista criado",
        description: "Especialista adicionado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/specialists"] });
      form.reset();
      setIsAddingSpecialist(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar especialista",
        variant: "destructive",
      });
    },
  });

  const deleteSpecialistMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/specialists/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Especialista removido",
        description: "Especialista removido com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/specialists"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover especialista",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SpecialistFormData) => {
    createSpecialistMutation.mutate(data);
  };

  const handleQuickAddClarissa = () => {
    form.setValue("username", "clarissa.vaz");
    form.setValue("email", "clarissa@metasyncdigital.com.br");
    form.setValue("password", "MetaSync2025!");
    form.setValue("firstName", "Clarissa");
    form.setValue("lastName", "Vaz");
    form.setValue("phone", "17997337322");
    form.setValue("speciality", "Consultoria em Negócios Digitais");
    form.setValue("bio", "Especialista em transformação digital e crescimento de negócios online. Consultora certificada em marketing digital e estratégias de vendas.");
    setIsAddingSpecialist(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administração de Especialistas</h1>
          <p className="text-muted-foreground">Gerencie os especialistas da plataforma</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleQuickAddClarissa}
            variant="outline"
            className="space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Clarissa Vaz</span>
          </Button>
          <Button
            onClick={() => setIsAddingSpecialist(true)}
            className="space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Especialista</span>
          </Button>
        </div>
      </div>

      {isAddingSpecialist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Adicionar Novo Especialista</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do especialista" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sobrenome do especialista" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="username.unico" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="email@exemplo.com" />
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
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" placeholder="Senha segura" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="17999999999" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="speciality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Área de atuação do especialista" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biografia</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descrição profissional do especialista" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Ativo</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={createSpecialistMutation.isPending}
                    className="space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {createSpecialistMutation.isPending ? "Salvando..." : "Salvar Especialista"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingSpecialist(false);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Especialistas Cadastrados</h2>
        {specialists.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum especialista cadastrado ainda.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Clique em "Adicionar Clarissa Vaz" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {specialists.map((specialist: any) => (
              <Card key={specialist.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={specialist.avatar} />
                        <AvatarFallback>
                          {specialist.firstName?.[0]}{specialist.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {specialist.firstName} {specialist.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">@{specialist.username}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{specialist.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{specialist.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={specialist.isActive ? "default" : "secondary"}>
                        {specialist.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSpecialistMutation.mutate(specialist.id)}
                        disabled={deleteSpecialistMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {specialist.speciality && (
                    <div className="mt-3">
                      <Badge variant="outline">{specialist.speciality}</Badge>
                    </div>
                  )}
                  {specialist.bio && (
                    <p className="mt-3 text-sm text-muted-foreground">{specialist.bio}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}