# Image de base Alpine avec Node.js
FROM node:22-alpine

# Mainteneur
LABEL maintainer="Mauricio <ceoseshell@gmail.com>"

# Créer le dossier de travail
WORKDIR /gospot

# Copier tous les fichiers du projet
COPY . .

# on netoie d'abord le cache
RUN npm cache clean --force

# Installer d'abord toutes les dépendances du projet
RUN npm install

# Puis installer le CLI globalement (facultatif)
RUN npm install -g .

# Définir le point d'entrée
ENTRYPOINT ["GoS"]
