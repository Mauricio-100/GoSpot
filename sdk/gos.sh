#!/bin/sh
# GoS v5.2 - Moteur de détection REDONDANT

# Stratégie 1 : Utiliser `ifconfig` (souvent le plus fiable sur iSH pour le Hotspot)
IP=$(ifconfig | grep -E "inet (192\.168\.[0-9]+\.1|172\.20\.10\.1)" | awk '{print $2}')

# Stratégie 2 (d'urgence) : Si `ifconfig` échoue, essayer `ip a`
if [ -z "$IP" ]; then
    IP=$(ip a | grep -E "inet (192\.168\.[0-9]+\.1|172\.20\.10\.1)" | awk '{print $2}')
fi

# Stratégie 3 (d'urgence ultime) : Si tout échoue, essayer de pinger l'IP par défaut
if [ -z "$IP" ]; then
    if ping -c 1 -W 2 172.20.10.1 > /dev/null 2>&1; then
        IP="172.20.10.1"
    fi
fi

# Résultat final
if [ -n "$IP" ]; then
    echo "$IP"
else
    echo "ERROR:IP_NOT_FOUND"
    exit 1
fi
