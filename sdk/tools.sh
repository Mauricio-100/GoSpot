#!/bin/sh

# GoS SDK Installer v1.2
# Installe une suite complète d'outils d'administration réseau.

# Fonctions pour des messages clairs
GREEN() { printf "\033[1;32m%s\033[0m\n" "$1"; }
YELLOW() { printf "\033[1;33m%s\033[0m\n" "$1"; }
INFO() { printf "%s\n" "$1"; }

INFO "Mise à jour de la liste des paquets Alpine..."
apk update

YELLOW "\n--- Installation de la Suite d'Outils GoS ---"
INFO "Installation de : openssh, iproute2, net-tools (ifconfig), nmap, curl, mariadb-client..."

# On installe tous les paquets en une seule commande pour plus d'efficacité
apk add openssh iproute2 net-tools nmap curl mariadb-client

GREEN "\n✅ La suite d'outils du SDK GoS a été installée avec succès !"
# Petite pause pour que l'utilisateur puisse lire le message final avant le retour au menu
sleep 2
