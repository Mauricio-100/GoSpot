# Image de base Alpine avec Node.js
FROM node:22-alpine

# Mainteneur
LABEL maintainer="Mauricio <ceoseshell@gmail.com>"

# Créer le dossier de travail
WORKDIR /gospot

# Copier tous les fichiers du projet
COPY . .

# Installer GoSpot globalement
RUN npm install -g .

# Définir le point d'entrée
ENTRYPOINT ["GoS"]
