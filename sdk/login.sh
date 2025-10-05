#!/bin/sh

# login.sh - Le Tableau de Bord d'Administration pour le Serveur GoSpot
# Par Mauricio

# Couleurs
GREEN() { printf "\033[1;32m%s\033[0m\n" "$1"; }
YELLOW() { printf "\033[1;33m%s\033[0m\n" "$1"; }
RED() { printf "\033[1;31m%s\033[0m\n" "$1"; }
INFO() { printf "%s\n" "$1"; }

# Fonction pour définir/changer le mot de passe root
set_password() {
    INFO "\nLe mot de passe root est essentiel pour la toute première connexion d'un client."
    INFO "Le client l'utilisera pour envoyer sa clé SSH et autoriser les connexions futures."
    YELLOW "Veuillez définir un mot de passe pour l'utilisateur 'root' :"
    passwd root
    GREEN "Mot de passe mis à jour avec succès."
    sleep 2
}

# Fonction pour gérer les clés des clients
manage_client_keys() {
    AUTHORIZED_KEYS_FILE="$HOME/.ssh/authorized_keys"
    
    if [ -f "$AUTHORIZED_KEYS_FILE" ]; then
        INFO "\n--- Clés des clients actuellement autorisées ---"
        # Affiche chaque clé avec un numéro
        cat -n "$AUTHORIZED_KEYS_FILE"
        INFO "-------------------------------------------"
    else
        YELLOW "\nAucune clé client n'est actuellement autorisée."
    fi

    printf "\nVoulez-vous effacer toutes les clés autorisées ? (dangereux) [y/N] "
    read -r choice
    if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
        rm -f "$AUTHORIZED_KEYS_FILE"
        GREEN "Toutes les clés autorisées ont été supprimées."
        INFO "Les clients devront se reconnecter en utilisant le mot de passe."
    fi
    sleep 2
}

# Fonction pour gérer le service sshd
manage_sshd() {
    if pgrep -f "sshd" > /dev/null; then
        YELLOW "\nLe serveur SSH est en cours d'exécution. Voulez-vous l'arrêter ? [y/N]"
        read -r choice
        if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
            pkill sshd
            GREEN "Serveur SSH arrêté."
        fi
    else
        YELLOW "\nLe serveur SSH est arrêté. Voulez-vous le démarrer ? [y/N]"
        read -r choice
        if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
            # S'assurer que les clés de l'hôte existent
            [ ! -f "/etc/ssh/ssh_host_rsa_key" ] && ssh-keygen -A
            sshd
            GREEN "Serveur SSH démarré."
        fi
    fi
    sleep 2
}

# --- Menu Principal ---
while true; do
    clear
    GREEN "--- Tableau de Bord d'Administration du Serveur GoSpot ---"
    
    # Vérification du statut du mot de passe
    PASS_STATUS=$(awk -F: '/^root:/ {print $2}' /etc/shadow)
    if [ -z "$PASS_STATUS" ] || [ "$PASS_STATUS" = "!" ] || [ "$PASS_STATUS" = "*" ]; then
        PASS_MSG=$(RED "(Aucun mot de passe défini ! REQUIS)")
    else
        PASS_MSG=$(GREEN "(Défini)")
    fi
    
    # Vérification du statut de SSHD
    if pgrep -f "sshd" > /dev/null; then
        SSHD_MSG=$(GREEN "[EN COURS]")
    else
        SSHD_MSG=$(RED "[ARRÊTÉ]")
    fi

    INFO "\nQue voulez-vous faire ?\n"
    INFO "  1. Définir / Changer le mot de passe root $PASS_MSG"
    INFO "  2. Gérer les clés des clients autorisés"
    INFO "  3. Gérer le service SSH (sshd) $SSHD_MSG"
    INFO "  4. Quitter"
    
    printf "\nVotre choix : "
    read -r main_choice

    case "$main_choice" in
        1) set_password ;;
        2) manage_client_keys ;;
        3) manage_sshd ;;
        4) break ;;
        *) RED "Choix invalide." && sleep 1 ;;
    esac
done

GREEN "\nÀ bientôt !"
