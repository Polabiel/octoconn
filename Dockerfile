# Imagem base Node.js LTS
FROM node:22
# Diretório de trabalho no container
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências e gerar Prisma Client
RUN npm install && npx prisma generate

# Copiar código fonte
COPY . .

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]