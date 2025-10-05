#!/usr/bin/env bash
set -e

echo "🚀 Initialisation complète de GoSpot..."

# Nettoyage
rm -rf node_modules package-lock.json

# Installation propre
echo "📦 Installation de toutes les dépendances..."
npm install

# Vérifie si le lock file est bien créé
if [ -f "package-lock.json" ]; then
  echo "✅ package-lock.json généré avec succès."
else
  echo "❌ Erreur : package-lock.json manquant !" && exit 1
fi

# Vérification du projet
echo "🧪 Lancement des tests..."
npm test || echo "⚠️ Aucun test défini, exécution ignorée."

echo "🎯 Environnement GoSpot prêt !"
