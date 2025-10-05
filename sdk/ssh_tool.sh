#!/bin/sh

# GoS SDK - Outil de Création de Clé SSH

# Couleurs
GREEN() { printf "\033[1;32m%s\033[0m\n" "$1"; }
YELLOW() { printf "\033[1;33m%s\033[0m\n" "$1"; }

YELLOW "\n--- Création d'une nouvelle clé SSH (ed25519) ---"
INFO "Veuillez suivre les instructions pour choisir l'emplacement et le mot de passe de la clé."

# Lance la commande interactive de création de clé
ssh-keygen -t ed25519

GREEN "\n✅ Opération terminée."
sleep 2
