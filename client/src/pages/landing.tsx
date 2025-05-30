import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import metaSyncLogo from "@assets/a88aad12-debb-48b7-9a26-acf54585d11e (1).png";

const registerSchema = z.object({
  fullName: z.string().min(2, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  acceptTerms: z.boolean().refine(val => val === true, "Você deve aceitar os termos"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Landing() {
  const [isLogin, setIsLogin] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (data: RegisterForm) => {
    console.log("Dados do formulário:", data);
    // Aqui seria feita a integração com a API de registro
    // Após sucesso, redirecionar para onboarding
    window.location.href = "/onboarding";
  };

  const acceptTerms = watch("acceptTerms");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Container Central */}
      <Card className="w-full max-w-lg bg-white shadow-2xl border-0">
        {/* Logo */}
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex items-center justify-center mb-6">
            <img 
              src={metaSyncLogo} 
              alt="MetaSync Digital" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Faça login na sua conta" : "Inicie seu teste gratuito de 14 dias"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? "Bem-vindo de volta ao MetaCircle" : "Nenhum cartão de crédito necessário"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Nome completo"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {!isLogin && (
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  Eu aceito os{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    termos
                  </a>{" "}
                  e a{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    política de privacidade
                  </a>
                </Label>
              </div>
            )}

            {errors.acceptTerms && (
              <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={!isLogin && !acceptTerms}
            >
              {isLogin ? "Entrar" : "Cadastre-se"}
            </Button>
          </form>

          {/* Links inferiores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {isLogin ? "Voltar para cadastro" : "Voltar"}
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Não tem uma conta?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Fazer login
                  </button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rodapé */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-gray-400 text-sm">
          Desenvolvido pela{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
            MetaSync Digital
          </span>
        </p>
      </div>
    </div>
  );
}