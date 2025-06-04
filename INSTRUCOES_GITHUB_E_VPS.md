# MetaSync - Instruções para GitHub e Deploy VPS

## 📤 PASSO 1: Enviar para o GitHub

### Como fazer o "commit" (salvar as mudanças no GitHub)

1. **Abra o terminal do Replit**
2. **Execute estes comandos na ordem:**

```bash
# Preparar os arquivos para envio
git add .

# Criar um "commit" (como um pacote com suas mudanças)
git commit -m "Sistema MetaSync finalizado - Login especialista responsivo + docs VPS"

# Enviar para o GitHub
git push origin main
```

**Se der erro, tente:**
```bash
git config --global user.email "seu-email@exemplo.com"
git config --global user.name "Seu Nome"
```

Depois repita os comandos acima.

---

## 🤖 PASSO 2: Instruções para a IA fazer Deploy na VPS

### Copie este texto completo e envie para a IA que vai fazer o deploy:

---

**SISTEMA METASYNC - DEPLOY VPS ATUALIZADO**

Olá! Preciso fazer o deploy das atualizações do sistema MetaSync na VPS. Aqui estão as informações:

**O QUE FOI ATUALIZADO:**
- ✅ Sistema MetaSync Admin completamente funcional
- ✅ Company Admin Dashboard implementado
- ✅ Login do especialista com design moderno e responsivo
- ✅ Logo MetaSync atualizado (novo arquivo de imagem)
- ✅ Sistema multi-tenant funcionando (PostgreSQL + Supabase)
- ✅ Design responsivo para mobile, tablet e desktop
- ✅ Navegação com sistema de tabs (sem sidebars)

**REPOSITÓRIO GITHUB:**
[Insira aqui o link do seu repositório GitHub]

**CREDENCIAIS DO SISTEMA PARA TESTE:**

MetaSync Admin:
- URL: /metasync-admin
- Usuário: admin.metasync
- Senha: metasync2024

Company Admin:
- URL: /company-admin-dashboard  
- Usuário: admin.clinica
- Senha: admin123

Specialist Login:
- URL: /specialist-login
- Usuário: clarissa
- Senha: specialist123

**COMANDOS PARA EXECUTAR NA VPS:**

1. Conectar na VPS e ir para o diretório:
```bash
cd /var/www/metasync
```

2. Fazer backup (opcional):
```bash
cp -r . ../metasync-backup-$(date +%Y%m%d-%H%M%S)
```

3. Baixar atualizações:
```bash
git pull origin main
```

4. Instalar dependências:
```bash
npm install
```

5. Aplicar mudanças no banco de dados:
```bash
npm run db:push
```

6. Fazer build da aplicação:
```bash
npm run build
```

7. Reiniciar os serviços:
```bash
pm2 restart metasync
```

8. Verificar se está funcionando:
```bash
pm2 status
pm2 logs metasync
```

**VERIFICAÇÕES APÓS DEPLOY:**

Testar estas URLs:
- Homepage: https://seu-dominio.com/
- MetaSync Admin: https://seu-dominio.com/metasync-admin
- Company Admin: https://seu-dominio.com/company-admin-dashboard
- Specialist Login: https://seu-dominio.com/specialist-login

**ARQUIVOS IMPORTANTES CRIADOS:**
- `VPS_DEPLOYMENT_README.md` - Guia completo de deploy
- `SISTEMA_STATUS_FINAL.md` - Status das funcionalidades
- `client/src/pages/specialist-login.tsx` - Nova página responsiva
- Novo logo em `attached_assets/46f86c96-0b2c-4594-9780-3980acc41951.png`

**PROBLEMAS COMUNS E SOLUÇÕES:**

Se der erro de build:
```bash
npm ci
npm run build
```

Se der erro de banco:
```bash
sudo systemctl restart postgresql
npm run db:push
```

Se der erro de permissões:
```bash
sudo chown -R www-data:www-data /var/www/metasync
```

**VARIÁVEIS DE AMBIENTE NECESSÁRIAS:**
Verificar se o arquivo .env tem:
```
DATABASE_URL=postgresql://user:password@localhost:5432/metasync
NODE_ENV=production
PORT=5000
```

Por favor, execute este deploy e me confirme quando estiver funcionando. O sistema está 100% funcional e pronto para produção.

---

## 📋 RESUMO PARA VOCÊ

1. **Execute os comandos Git** para enviar para o GitHub
2. **Copie todo o texto do "PASSO 2"** e envie para a IA que vai fazer o deploy
3. **Aguarde a confirmação** de que o deploy foi concluído

O sistema está completamente pronto e todas as funcionalidades foram testadas!