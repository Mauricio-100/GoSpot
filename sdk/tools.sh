#!/bin/sh

# GoS SDK Installer
# Cet outil installe toutes les dépendances Linux requises.

# Couleurs
GREEN() { printf "\033[1;32m%s\033[0m\n" "$1"; }
INFO() { printf "%s\n" "$1"; }

INFO "Mise à jour de la liste des paquets..."
apk update

INFO "\nInstallation des outils réseau et SSH..."
apk add openssh iproute2

INFO "\nInstallation du client MySQL/MariaDB..."
# iSH utilise le client mariadb, qui est compatible mysql
apk add mariadb-client

GREEN "\n✅ Tous les outils du SDK GoS sont installés !"
sleep 2
