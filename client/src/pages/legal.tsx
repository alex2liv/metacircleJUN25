import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Shield, 
  Download,
  ExternalLink,
  Calendar,
  Mail,
  Phone
} from "lucide-react";

export default function Legal() {
  const [activeTab, setActiveTab] = useState("terms");

  const lastUpdated = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Termos Legais</h1>
        <p className="text-gray-600">
          Transparência total sobre como operamos e protegemos seus dados
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Calendar className="w-3 h-3 mr-1" />
            Atualizado em {lastUpdated}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Shield className="w-3 h-3 mr-1" />
            LGPD Compliant
          </Badge>
        </div>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Termos de Serviço
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Política de Privacidade
          </TabsTrigger>
        </TabsList>

        {/* Termos de Serviço */}
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Termos de Serviço - MetaCircle
              </CardTitle>
              <p className="text-sm text-gray-600">
                Última atualização: {lastUpdated}
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-6 text-sm">
                
                <section>
                  <h3 className="text-lg font-semibold mb-3">1. Aceitação dos Termos</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Ao acessar e usar o MetaCircle, você concorda em cumprir e ficar vinculado por estes Termos de Serviço. 
                    Se você não concordar com qualquer parte destes termos, não poderá acessar o Serviço.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">2. Descrição do Serviço</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    O MetaCircle é uma plataforma de comunidades online que permite criar, gerenciar e participar de comunidades digitais.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Criação e gerenciamento de comunidades</li>
                    <li>Sistema de posts, comentários e discussões</li>
                    <li>Chat em tempo real e videochamadas</li>
                    <li>Sistema de eventos e calendário</li>
                    <li>Integração com plataformas de pagamento</li>
                    <li>Assistente IA para suporte</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">3. Planos e Pagamentos</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tipos de Plano:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li><strong>🥉 Básico:</strong> Funcionalidades essenciais</li>
                      <li><strong>🥈 Intermediário:</strong> Recursos expandidos</li>
                      <li><strong>👑 Premium:</strong> Acesso completo + SOS</li>
                    </ul>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">🎁 Período de Teste</p>
                    <p className="text-green-700 text-sm">14 dias Premium gratuito para novos usuários</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">4. Uso Aceitável</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Você NÃO pode:</h4>
                    <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                      <li>Violar leis ou regulamentos</li>
                      <li>Postar conteúdo ilegal ou abusivo</li>
                      <li>Assediar outros usuários</li>
                      <li>Usar para spam</li>
                      <li>Tentar hackear o sistema</li>
                      <li>Compartilhar login com terceiros</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">5. Propriedade Intelectual</h3>
                  <p className="text-gray-700 leading-relaxed">
                    O serviço e tecnologia são propriedade da MetaSync Digital. Você mantém direitos sobre seu conteúdo, 
                    mas concede licença para hospedarmos e exibirmos.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">6. Cancelamento e Rescisão</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <h4 className="font-medium mb-1">Por Você</h4>
                      <p className="text-sm text-gray-600">Pode cancelar a qualquer momento nas configurações</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <h4 className="font-medium mb-1">Por Nós</h4>
                      <p className="text-sm text-gray-600">Podemos suspender por violação dos termos</p>
                    </div>
                  </div>
                </section>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Política de Privacidade */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Política de Privacidade - MetaCircle
              </CardTitle>
              <p className="text-sm text-gray-600">
                Última atualização: {lastUpdated}
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-6 text-sm">

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">📋 Resumo</h3>
                  <p className="text-blue-800 text-sm">
                    Respeitamos sua privacidade e protegemos seus dados pessoais. Coletamos apenas informações 
                    necessárias para nossos serviços e <strong>nunca vendemos seus dados para terceiros</strong>.
                  </p>
                </div>

                <section>
                  <h3 className="text-lg font-semibold mb-3">1. Informações que Coletamos</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">📝 Fornecidas por Você</h4>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Nome e email</li>
                        <li>• Foto de perfil</li>
                        <li>• Posts e comentários</li>
                        <li>• Dados de pagamento</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">🔍 Coletadas Automaticamente</h4>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Páginas visitadas</li>
                        <li>• Endereço IP</li>
                        <li>• Tipo de navegador</li>
                        <li>• Cookies técnicos</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded border border-purple-200">
                      <h4 className="font-medium text-purple-800 mb-2">🔗 De Terceiros</h4>
                      <ul className="text-xs text-purple-700 space-y-1">
                        <li>• WhatsApp (autorizado)</li>
                        <li>• YouTube (público)</li>
                        <li>• Stripe (pagamentos)</li>
                        <li>• Analytics (anônimo)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">2. Como Usamos Suas Informações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded">
                        <h4 className="font-medium text-blue-800">🛠️ Prestação de Serviços</h4>
                        <p className="text-xs text-blue-700 mt-1">Gerenciar conta, processar pagamentos, facilitar comunicação</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded">
                        <h4 className="font-medium text-green-800">📈 Melhorias</h4>
                        <p className="text-xs text-green-700 mt-1">Analisar uso, desenvolver recursos, monitorar performance</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded">
                        <h4 className="font-medium text-orange-800">📧 Comunicações</h4>
                        <p className="text-xs text-orange-700 mt-1">Atualizações importantes, notificações de atividades</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded">
                        <h4 className="font-medium text-red-800">⚖️ Conformidade</h4>
                        <p className="text-xs text-red-700 mt-1">Cumprir leis, investigar fraudes, proteger direitos</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">3. Seus Direitos (LGPD)</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">✅ Você Pode:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Acessar seus dados</li>
                          <li>• Corrigir informações</li>
                          <li>• Deletar sua conta</li>
                          <li>• Exportar dados</li>
                          <li>• Restringir processamento</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800 mb-2">⏱️ Prazos:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Solicitações simples: 15 dias</li>
                          <li>• Solicitações complexas: 30 dias</li>
                          <li>• Emergências: 72 horas</li>
                          <li>• Resposta sempre garantida</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">4. Segurança e Retenção</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">🔒 Segurança</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Criptografia em trânsito e repouso</li>
                        <li>• Autenticação de dois fatores</li>
                        <li>• Acesso restrito funcionários</li>
                        <li>• Monitoramento 24/7</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-orange-50 rounded border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-2">📅 Retenção</h4>
                      <ul className="text-xs text-orange-700 space-y-1">
                        <li>• Conta ativa: dados mantidos</li>
                        <li>• Cancelamento: 30 dias graça</li>
                        <li>• Legal: 90 dias máximo</li>
                        <li>• Após: deleção permanente</li>
                      </ul>
                    </div>
                  </div>
                </section>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Seção de Contato */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Mail className="w-5 h-5" />
            Dúvidas ou Exercer Direitos?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Email</div>
                <div className="text-xs text-gray-600">privacy@metasync.com.br</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">WhatsApp</div>
                <div className="text-xs text-gray-600">17 99733-7322</div>
              </div>
            </div>
            
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Portal de Privacidade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Termos de Serviço (PDF)
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Política de Privacidade (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}