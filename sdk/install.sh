#!/bin/sh

# GoSpot - L'Installateur Intelligent
# Par Mauricio

# Couleurs avec printf
GREEN() { printf "\033[1;32m%s\033[0m\n" "$1"; }
YELLOW() { printf "\033[1;33m%s\033[0m\n" "$1"; }
INFO() { printf "%s\n" "$1"; }

# --- Début de l'installation ---
GREEN "🚀 Bienvenue dans l'installateur GoSpot !"
INFO "Ce script va configurer l'application GoS sur votre terminal iSH."

# 1. Vérification et installation des dépendances
INFO "\n1/4 - Vérification des dépendances..."
apk update > /dev/null
apk add git nodejs npm > /dev/null
GREEN "Dépendances assurées."

# 2. Clonage du dépôt
INFO "\n2/4 - Téléchargement des sources de GoSpot..."
# On supprime l'ancien dossier s'il existe pour une installation propre
rm -rf /tmp/gospot-src
git clone https://github.com/Mauricio-100/GoSpot.git /tmp/gospot-src
GREEN "Sources téléchargées."

# 3. Installation du package NPM
INFO "\n3/4 - Installation de l'application GoS..."
cd /tmp/gospot-src/gospot
# npm install -g . installe le package depuis le dossier local
npm install -g .
GREEN "Application GoS installée avec succès."

# 4. Nettoyage
INFO "\n4/4 - Nettoyage des fichiers d'installation..."
cd ~
rm -rf /tmp/gospot-src
GREEN "Nettoyage terminé."

# --- Fin de l'installation ---
INFO "\n🎉 L'installation est terminée !"
GREEN "Vous pouvez maintenant lancer l'application à tout moment en tapant simplement :"
YELLOW "\n  GoS\n"
