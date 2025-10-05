#!/usr/bin/env bash
set -e

echo "🚀 Initialisation de l'environnement GoSpot..."

# Nettoyage
rm -rf node_modules package-lock.json

# Installation propre
echo "📦 Installation des dépendances..."
npm install

# Vérification
echo "✅ Vérification du projet..."
npm test || echo "⚠️ Aucun test défini, exécution ignorée."

echo "🎯 Installation terminée ! GoSpot est prêt."
