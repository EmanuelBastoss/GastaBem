# GastaBem Web

## Introdução

GastaBem é um projeto web que ajuda os usuários a gerenciar seus gastos. O projeto é composto por uma api (api-financeira) e um frontend em React.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte software instalado:

- **Laragon:** Para gerenciar o ambiente de desenvolvimento local. https://laragon.org/download/

## Configuração do Ambiente

1. **Inicie o Laragon:**
   - Abra o Laragon e inicie o servidor Apache e MySQL.



## Instalação

1.**inicie o laragon antes dessa parte**
2.**inicie o laragon antes dessa parte**

1. **Clone o Repositório:**

   - **abra o cmd e use os comandos:**
   - ` cd C:\laragon\www `
   - ` git clone https://github.com/EmanuelBastoss/GastaBem.git `
   - ` cd gastabem `
   - ` npm install `

2. **Configurar Variáveis de Ambiente:**

**Ajuste as configurações no arquivo .env conforme necessário para seu ambiente.**


   - Crie um arquivo `.env` na raiz de cada API (`auth-api` e `api-gastos`) com o seguinte conteúdo:

     ```
  DB_USER=root
DB_PASSWORD=
DB_NAME=gastabem_db
DB_HOST=127.0.0.1
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
JWT_SECRET=sua_chave_secreta

     ```

## criação dos bancos de dados e instalação de dependencias
- **criação dos bancos de dados e instalação de dependencias**



**comandos na pasta Raiz para criar os bancos**

-``cd api-financeira``
-``db:create gastabem_db``
-``sequelize-cli db:migrate``


## Execução do Projeto
3. **Execução do Projeto**

- execute o ``start-all.bat`` para iniciar o frontend e as apis em novas janelas de terminal.


