FROM node:23-alpine AS build

WORKDIR /app

RUN apt-get update && apt-get install -y openssl libssl1.1

# Copie les fichiers nécessaires
COPY package.json package-lock.json* ./
RUN npm ci

# Copie tout le code source
COPY . .

# Build de l'application
RUN npm run build

# Étape finale : image plus légère pour exécuter l'app
FROM node:23-alpine

WORKDIR /app

# Copie les fichiers de build depuis l’étape précédente
COPY --from=build /app /app

# Installation uniquement des dépendances de production
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "build"]
