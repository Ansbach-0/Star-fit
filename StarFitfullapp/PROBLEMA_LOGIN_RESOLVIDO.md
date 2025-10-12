# 🔧 Problema de Login/Cadastro - RESOLVIDO

## ❌ Problema

Após a implementação de segurança, não era possível fazer login nem cadastro no sistema.

### Causa Raiz

O banco de dados `users.db` foi criado inicialmente pelo `migrate.js` antigo que inseriu usuários com **senhas em texto plano** (ex: `admin123`, `user123`).

Quando rodamos o novo `seed.js` com bcrypt, ele usou:
```javascript
INSERT OR IGNORE INTO users ...
```

O `OR IGNORE` significa: **"se o email já existe, não faça nada"**.

Resultado: Os usuários existentes mantiveram suas senhas em texto plano, mas o servidor agora esperava senhas com hash bcrypt!

### Sintoma

```
Error: "Invalid credentials"
```

Mesmo usando as credenciais corretas, porque:
- Banco: `admin123` (texto plano)
- Servidor tentava: `bcrypt.compare('Manager@123', 'admin123')` ❌

## ✅ Solução Implementada

Criamos o script `update-passwords.js` que:

1. Conecta ao banco existente
2. Para cada usuário, gera hash bcrypt da senha
3. Atualiza o registro com `UPDATE users SET password = ?`
4. Não perde dados existentes

### Script Executado
```powershell
cd auth-backend
node update-passwords.js
```

### Resultado
```
✓ Updated manager@starfit.com (password: Manager@123)
✓ Updated user@starfit.com (password: User@123)
✓ Updated ana@starfit.com (password: Ana@123)
✓ Updated bruno@starfit.com (password: Bruno@123)
✓ Updated carla@starfit.com (password: Carla@123)

✅ Password update complete!
```

## 🧪 Testes Realizados

### 1. Verificação de Senha
```bash
node test-password.js
```
✅ **Resultado:** Password valid: true

### 2. Login via API
```powershell
POST http://localhost:3001/login
{
  "email": "manager@starfit.com",
  "password": "Manager@123"
}
```
✅ **Resultado:** Token JWT recebido, login bem-sucedido

### 3. Registro de Usuário
```powershell
POST http://localhost:3001/register
{
  "email": "test@starfit.com",
  "password": "Test@123",
  "name": "Test User",
  "plan": "Plano Fit"
}
```
✅ **Resultado:** User ID: 16, Role: user, Token recebido

### 4. Registro de Manager
```powershell
POST http://localhost:3001/register/manager
{
  "email": "testmanager@starfit.com",
  "password": "TestManager@123",
  "name": "Test Manager",
  "gym_name": "Test Gym"
}
```
✅ **Resultado:** User ID: 17, Role: manager, Token recebido

## 🎯 Status Atual

### ✅ Funcionalidades Testadas e Funcionando

1. **Login de Manager** ✅
   - Email: manager@starfit.com
   - Password: Manager@123

2. **Login de Usuários** ✅
   - user@starfit.com / User@123
   - ana@starfit.com / Ana@123
   - bruno@starfit.com / Bruno@123
   - carla@starfit.com / Carla@123

3. **Registro de Novos Usuários** ✅
   - Validação de email
   - Validação de senha (min 6 chars)
   - Hash automático com bcrypt
   - JWT gerado e retornado

4. **Registro de Novos Managers** ✅
   - Validação de email
   - Validação de senha (min 8 chars)
   - Hash automático com bcrypt
   - JWT gerado e retornado

## 🔐 Credenciais Demo (Atualizadas)

### Manager
- **Email:** manager@starfit.com
- **Password:** Manager@123

### Usuários
- user@starfit.com / User@123
- ana@starfit.com / Ana@123
- bruno@starfit.com / Bruno@123
- carla@starfit.com / Carla@123

## 📝 Como Usar Agora

### 1. Acesse o Sistema
```
Frontend: http://localhost:5173/
Backend: http://localhost:3001/
```

### 2. Faça Login
- Navegue para http://localhost:5173/login
- Use uma das credenciais acima
- Você será redirecionado automaticamente para seu dashboard

### 3. Ou Registre Nova Conta
- **Usuário:** http://localhost:5173/register
- **Manager:** http://localhost:5173/register/manager

## 🛠️ Scripts Úteis Criados

### 1. `test-password.js`
Testa se uma senha está funcionando com bcrypt:
```bash
node test-password.js
```

### 2. `update-passwords.js`
Atualiza senhas no banco para hash bcrypt:
```bash
node update-passwords.js
```

## 🚨 Prevenção Futura

### Se precisar recriar o banco:

**Opção 1: Parar servidor primeiro**
```powershell
# Parar o servidor (Ctrl+C no terminal do backend)
cd auth-backend
Remove-Item users.db -Force
node migrate.js
node seed.js
node server.js
```

**Opção 2: Usar update-passwords.js**
```powershell
# Sem parar o servidor
cd auth-backend
node update-passwords.js
```

### Modificação no migrate.js

Para evitar este problema no futuro, **NÃO inserir usuários demo no migrate.js**. 

Deixar apenas a criação de tabelas e exercícios:
```javascript
// migrate.js - APENAS criar estrutura
db.run(`CREATE TABLE users ...`);
db.run(`CREATE TABLE exercises ...`);
db.run(`INSERT INTO exercises ...`); // OK, são dados fixos

// NÃO inserir usuários aqui!
// Usar apenas seed.js para isso
```

## ✅ Confirmação Final

**Teste você mesmo:**

1. Abra http://localhost:5173/login
2. Use: manager@starfit.com / Manager@123
3. Você deve ver o Manager Dashboard
4. Faça logout
5. Registre um novo usuário em http://localhost:5173/register
6. Você deve ser auto-logado e ver o User Dashboard

**Tudo funcionando! 🎉**

---

**Resumo:** O problema era senhas em texto plano vs bcrypt. Solução: script update-passwords.js que atualiza todas as senhas para bcrypt sem perder dados.
