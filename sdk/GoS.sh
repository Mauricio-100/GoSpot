#!/bin/sh
# GoS v3.1 - Moteur d'exécution

# Logique SERVEUR
run_server() {
    # S'assure que le serveur est démarré
    if ! pgrep -f "sshd" > /dev/null; then
        # Génère les clés de l'hôte si elles n'existent pas
        [ ! -f "/etc/ssh/ssh_host_rsa_key" ] && ssh-keygen -A > /dev/null 2>&1
        sshd
    fi
    # Affiche l'IP pour que le script Node puisse la récupérer si besoin
    echo "172.20.10.1"
}

# Logique CLIENT
run_client() {
    SERVER_IP=$(arp -a | grep -o '172.20.10.1')
    if [ -z "$SERVER_IP" ]; then
        echo "ERROR:SERVER_NOT_FOUND"
        exit 1
    fi
    
    # La logique de connexion SSH interactive est mieux gérée en Node.js
    # Ce script confirme juste que le serveur est trouvable.
    echo "$SERVER_IP"
}

case "$1" in
    serve) run_server ;;
    connect) run_client ;;
esac
