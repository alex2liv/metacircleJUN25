import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/hooks/use-auth";
import { usePerfectPayIntegration } from "@/lib/perfectpay-integration";
import { RoleBasedLayout } from "@/components/role-based-layout";
import { Plus, FileText, Calendar, Users, MessageSquare, BookOpen } from "lucide-react";
import { insertPostSchema, insertEventSchema } from "@shared/schema";
import { z } from "zod";

const createPostSchema = insertPostSchema.extend({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

const createEventSchema = insertEventSchema.extend({
  title: z.string().min(1, "Título é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  description: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
});

export function CreateMenu() {
  const [createType, setCreateType] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock community ID - in real app would come from context
  const communityId = 3;

  // Get spaces for the current community
  const { data: spaces } = useQuery({
    queryKey: [`/api/communities/${communityId}/spaces`],
    queryFn: () => api.getCommunitySpaces(communityId),
  });

  const postForm = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: 1, // Mock user ID
      spaceId: 0,
    },
  });

  const eventForm = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "online",
      isOnline: true,
      spaceId: 0,
      organizerId: 1, // Mock user ID
    },
  });

  // Função para calcular automaticamente a data/hora de fim
  const handleStartDateChange = (startDateTime: string) => {
    if (startDateTime) {
      const startDate = new Date(startDateTime);
      // Adicionar 1 hora automaticamente
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const endDateString = endDate.toISOString().slice(0, 16);
      eventForm.setValue('endDate', endDateString);
    }
  };

  const createPostMutation = useMutation({
    mutationFn: api.createPost,
    onSuccess: () => {
      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/posts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/stats`] });
      setCreateType(null);
      postForm.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao criar post",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: api.createEvent,
    onSuccess: () => {
      toast({
        title: "Evento criado!",
        description: "Seu evento foi agendado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/events`] });
      queryClient.invalidateQueries({ queryKey: [`/api/communities/${communityId}/stats`] });
      setCreateType(null);
      eventForm.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao criar evento",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const onCreatePost = (values: z.infer<typeof createPostSchema>) => {
    createPostMutation.mutate(values);
  };

  const onCreateEvent = (values: z.infer<typeof createEventSchema>) => {
    const eventData = {
      ...values,
      startDate: new Date(values.startDate).toISOString(),
      endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
      description: values.description || null,
      location: values.location || null,
    };
    createEventMutation.mutate(eventData);
  };

  const createOptions = [
    {
      id: "post",
      label: "Novo Post",
      icon: FileText,
      description: "Compartilhe uma ideia ou discussão",
    },
    {
      id: "event",
      label: "Evento",
      icon: Calendar,
      description: "Agende um workshop ou encontro",
    },

    {
      id: "community",
      label: "Comunidade",
      icon: Users,
      description: "Criar uma nova comunidade",
    },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Criar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {createOptions.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.id}
                onClick={() => setCreateType(option.id)}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <Icon className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Post Dialog */}
      <Dialog open={createType === "post"} onOpenChange={() => setCreateType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Criar Novo Post
            </DialogTitle>
            <DialogDescription>
              Compartilhe suas ideias e inicie discussões na comunidade
            </DialogDescription>
          </DialogHeader>

          <Form {...postForm}>
            <form onSubmit={postForm.handleSubmit(onCreatePost)} className="space-y-4">
              <FormField
                control={postForm.control}
                name="spaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Espaço</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um espaço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {spaces?.map((space: any) => (
                          <SelectItem key={space.id} value={space.id.toString()}>
                            {space.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={postForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do seu post..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={postForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="O que você gostaria de compartilhar?"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateType(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createPostMutation.isPending}>
                  {createPostMutation.isPending ? "Publicando..." : "Publicar Post"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={createType === "event"} onOpenChange={() => setCreateType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Criar Novo Evento
            </DialogTitle>
            <DialogDescription>
              Agende workshops, encontros e outras atividades da comunidade
            </DialogDescription>
          </DialogHeader>

          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(onCreateEvent)} className="space-y-4">
              <FormField
                control={eventForm.control}
                name="spaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Espaço</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um espaço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {spaces?.filter((space: any) => space.type === "event").map((space: any) => (
                          <SelectItem key={space.id} value={space.id.toString()}>
                            {space.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={eventForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do seu evento..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={eventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os detalhes do evento..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={eventForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data e Hora de Início</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleStartDateChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={eventForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data e Hora de Fim (opcional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={eventForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço ou link online..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateType(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createEventMutation.isPending}>
                  {createEventMutation.isPending ? "Criando..." : "Criar Evento"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Placeholder dialogs for other types */}
      <Dialog open={createType === "course"} onOpenChange={() => setCreateType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Criar Curso
            </DialogTitle>
            <DialogDescription>
              Funcionalidade em desenvolvimento. Em breve você poderá criar cursos completos com vídeos e materiais.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setCreateType(null)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createType === "community"} onOpenChange={() => setCreateType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Criar Comunidade
            </DialogTitle>
            <DialogDescription>
              Funcionalidade em desenvolvimento. Em breve você poderá criar novas comunidades com temas personalizados.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setCreateType(null)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}