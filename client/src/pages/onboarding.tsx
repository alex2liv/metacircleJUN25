import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import metaSyncLogo from "@assets/MetaSync Logo Jun2025.png";

// Schemas para validação de cada etapa
const step1Schema = z.object({
  communityName: z.string().min(2, "Nome da comunidade é obrigatório"),
  communityUrl: z.string().min(2, "URL é obrigatória"),
  language: z.string().min(1, "Selecione um idioma"),
});

const step2Schema = z.object({
  annualRevenue: z.string().min(1, "Selecione sua receita anual"),
  goal: z.string().min(1, "Selecione seu objetivo"),
  howFound: z.string().min(2, "Conte como conheceu o MetaCircle"),
});

const step3Schema = z.object({
  features: z.array(z.string()).min(1, "Selecione pelo menos um recurso"),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

const revenueOptions = [
  "Menos de R$ 100 mil",
  "R$ 100 mil - R$ 500 mil",
  "R$ 500 mil - R$ 1 milhão",
  "R$ 1 milhão - R$ 5 milhões",
  "Mais de R$ 5 milhões"
];

const goalOptions = [
  "Construir uma nova comunidade",
  "Migrar para o MetaCircle",
  "Não tenho um objetivo – estou apenas explorando"
];

const features = [
  "Discussões",
  "Eventos",
  "Chat",
  "Agentes de IA",
  "Construtor de sites",
  "Pagamentos recorrentes",
  "Cursos",
  "Transmissões ao vivo",
  "Email marketing",
  "Gamificação",
  "Aplicativo personalizado",
  "Ferramentas para desenvolvedores"
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    step1: {} as Step1Form,
    step2: {} as Step2Form,
    step3: {} as Step3Form,
  });

  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      communityName: "",
      communityUrl: "",
      language: "",
    },
  });

  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      annualRevenue: "",
      goal: "",
      howFound: "",
    },
  });

  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      features: [],
    },
  });

  const onStep1Submit = (data: Step1Form) => {
    setFormData(prev => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const onStep2Submit = (data: Step2Form) => {
    setFormData(prev => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const onStep3Submit = (data: Step3Form) => {
    setFormData(prev => ({ ...prev, step3: data }));
    // Aqui seria feita a criação da comunidade
    console.log("Dados completos:", { ...formData, step3: data });
    // Redirecionar para dashboard
    window.location.href = "/dashboard";
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(newFeatures);
    step3Form.setValue("features", newFeatures);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-xl border-0">
        {/* Logo */}
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-32 h-24 flex items-center justify-center mb-4">
            <img 
              src={metaSyncLogo} 
              alt="MetaSync Digital" 
              className="h-20 w-auto object-contain"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Etapa 1: Criar Comunidade */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Agora vamos criar sua comunidade
                </h1>
                <p className="text-gray-500">
                  Não se preocupe — você pode alterar essas informações depois
                </p>
              </div>

              <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                <div>
                  <Label htmlFor="communityName">Nome da comunidade</Label>
                  <Input
                    id="communityName"
                    placeholder="Alexandre Nunes's Comunidade"
                    className="h-12"
                    {...step1Form.register("communityName")}
                  />
                  {step1Form.formState.errors.communityName && (
                    <p className="text-red-500 text-sm mt-1">
                      {step1Form.formState.errors.communityName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="communityUrl">URL da comunidade</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="communityUrl"
                      placeholder="alexandre-nunes-comunidade"
                      className="h-12 flex-1"
                      {...step1Form.register("communityUrl")}
                    />
                    <span className="text-gray-500 font-medium">.metacircle.com</span>
                  </div>
                  {step1Form.formState.errors.communityUrl && (
                    <p className="text-red-500 text-sm mt-1">
                      {step1Form.formState.errors.communityUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Idioma padrão</Label>
                  <Select onValueChange={(value) => step1Form.setValue("language", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                  {step1Form.formState.errors.language && (
                    <p className="text-red-500 text-sm mt-1">
                      {step1Form.formState.errors.language.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                  >
                    Próximo
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Etapa 2: Informações do usuário */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Conte um pouco sobre você
                </h1>
                <p className="text-gray-500">
                  Nós utilizaremos isso para te oferecer a melhor experiência de onboarding
                </p>
              </div>

              <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                <div>
                  <Label>Qual é sua receita anual?</Label>
                  <Select onValueChange={(value) => step2Form.setValue("annualRevenue", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione sua receita anual" />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {step2Form.formState.errors.annualRevenue && (
                    <p className="text-red-500 text-sm mt-1">
                      {step2Form.formState.errors.annualRevenue.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>O que você espera alcançar com o MetaCircle?</Label>
                  <Select onValueChange={(value) => step2Form.setValue("goal", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {step2Form.formState.errors.goal && (
                    <p className="text-red-500 text-sm mt-1">
                      {step2Form.formState.errors.goal.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="howFound">Como você conheceu o MetaCircle?</Label>
                  <Textarea
                    id="howFound"
                    placeholder="Conte como descobriu nossa plataforma..."
                    className="min-h-[100px]"
                    {...step2Form.register("howFound")}
                  />
                  {step2Form.formState.errors.howFound && (
                    <p className="text-red-500 text-sm mt-1">
                      {step2Form.formState.errors.howFound.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                  >
                    Próximo
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Etapa 3: Seleção de recursos */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  O que é essencial para sua comunidade?
                </h1>
              </div>

              <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {features.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={cn(
                        "p-4 border-2 rounded-lg text-center transition-all duration-200 hover:scale-105",
                        selectedFeatures.includes(feature)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {selectedFeatures.includes(feature) && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                        <span className="font-medium">{feature}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {step3Form.formState.errors.features && (
                  <p className="text-red-500 text-sm text-center">
                    {step3Form.formState.errors.features.message}
                  </p>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                  >
                    Finalizar
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}