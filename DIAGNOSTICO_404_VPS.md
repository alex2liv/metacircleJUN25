# Diagnóstico Erro 404 Persistente - VPS

## Comandos para Diagnóstico

Execute estes comandos na VPS para identificar o problema:

### 1. Verificar se o container está rodando
```bash
cd /opt/metasync/metacircle-frontend
docker-compose ps
docker-compose logs --tail=50
```

### 2. Verificar se o build foi criado
```bash
ls -la dist/
ls -la dist/index.html
```

### 3. Verificar configuração do Nginx
```bash
cat /etc/nginx/sites-available/metacircle
nginx -t
systemctl status nginx
```

### 4. Testar diretamente o container
```bash
# Descobrir a porta do container
docker-compose ps
# Testar acesso direto (substitua PORTA pela porta real)
curl -I http://localhost:PORTA
```

### 5. Verificar logs específicos
```bash
docker-compose logs web --tail=100
journalctl -u nginx --tail=50
```

### 6. Verificar se arquivos estão sendo servidos
```bash
# Dentro do container
docker-compose exec web ls -la /app/dist/
docker-compose exec web cat /app/dist/index.html | head -20
```

## Possíveis Causas

1. **Build não foi gerado**: Falta `npm run build`
2. **Container não reiniciou**: Docker não aplicou mudanças
3. **Nginx mal configurado**: Proxy não está apontando certo
4. **Porta errada**: Container rodando em porta diferente
5. **Permissões**: Arquivos não acessíveis

## Soluções por Cenário

### Se o build não existe:
```bash
cd /opt/metasync/metacircle-frontend
npm run build
docker-compose restart
```

### Se o container não está rodando:
```bash
docker-compose down
docker-compose up -d --build
```

### Se Nginx está mal configurado:
Verificar se aponta para a porta correta do container

### Build forçado completo:
```bash
cd /opt/metasync/metacircle-frontend
rm -rf dist/ node_modules/
npm install
npm run build
docker-compose down
docker-compose up -d --build
```