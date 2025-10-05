# Utilise l’image Node DevContainer officielle
FROM mcr.microsoft.com/devcontainers/javascript-node:22

# Installe des outils supplémentaires
RUN apt-get update && apt-get install -y \
    git \
    curl \
    nano \
    && rm -rf /var/lib/apt/lists/*
