GastaBem Web
Introdução
GastaBem é uma aplicação web para gerenciamento financeiro pessoal, desenvolvida com React no frontend e Node.js/Express no backend. O projeto permite aos usuários controlar suas finanças através de um sistema intuitivo de lançamentos de entrada e saída.

Tecnologias Utilizadas
Frontend: React, Bootstrap, Chart.js
Backend: Node.js, Express, Sequelize
Banco de Dados: MySQL
Documentação: Swagger
Autenticação: JWT

Pré-requisitos
Laragon (inclui MySQL)
Node.js (versão 14 ou superior)
NPM (gerenciador de pacotes do Node.js)
Instalação
Preparação do Ambiente
   # Inicie o Laragon e seus serviços (MySQL)
   # Abra o terminal e navegue até a pasta www do Laragon
   cd C:\laragon\www

   # Clone o repositório
   -git clone https://github.com/EmanuelBastoss/GastaBem.git
   
   -cd gastabem

   # Instale as dependências
   npm install
   
Configuração do Ambiente
Crie um arquivo .env na pasta api-financeira com as seguintes configurações:

   DB_USER=root
   
   DB_PASSWORD=
   
   DB_NAME=gastabem_db
   
   DB_HOST=localhost
   
   PORT=5000
   
   DB_PORT=3306
   
   DB_DIALECT=mysql
   
   JWT_SECRET=sua_chave_secreta
   

   
Configuração do Banco de Dados

   # Navegue até a pasta da API
   cd api-financeira

   # Crie o banco de dados
   npx sequelize-cli db:create

   # Execute as migrações
   npx sequelize-cli db:migrate

   
Execução do Projeto
Iniciar a Aplicação
Execute o arquivo start-all.bat na raiz do projeto
Ou inicie manualmente cada parte:
     # Terminal 1 - API
     cd api-financeira
     npm start
     # Terminal 2 - Frontend
     cd frontend
     npm start
     
Acessando a Aplicação

Frontend: http://localhost:5173

API: http://localhost:5000


# Documentação Swagger: http://localhost:5000/api-docs

Documentação da API
A documentação completa da API está disponível através do Swagger UI. Principais endpoints:

Autenticação
POST /api/auth/register - Registro de usuário
POST /api/auth/login - Login
POST /api/auth/reset-password - Redefinição de senha

Lançamentos
GET /api/lancamentos - Lista todos os lançamentos
POST /api/lancamentos - Cria novo lançamento
PUT /api/lancamentos/:id - Atualiza lançamento
DELETE /api/lancamentos/:id - Remove lançamento
