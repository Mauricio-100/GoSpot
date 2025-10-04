<div align="center">

```
 ____ ____ ____
/ ___/ ___/ ___|
| |  | |  | |___
| |__| |__|___  |
\____\____|____/
```

# GoSpot for iSH Shell

**Connexion SSH interactive et ultra-légère entre deux appareils iOS, sans jamais taper une adresse IP.**

<p>
    <a href="https://github.com/Mauricio-100/GoSpot/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licence MIT"></a>
    <a href="https://www.npmjs.com/package/gospot-ish"><img src="https://img.shields.io/npm/v/gospot-ish.svg" alt="Version NPM"></a>
    <img src="https://img.shields.io/badge/Made%20for-iSH%20Shell-black?logo=apple" alt="Fait pour iSH">
    <img src="https://img.shields.io/github/last-commit/Mauricio-100/GoSpot" alt="Dernier Commit">
</p>

</div>

---

GoSpot est un outil en ligne de commande qui élimine la complexité des connexions SSH entre deux appareils mobiles. Fini la recherche d'adresses IP locales ! GoSpot utilise le Partage de connexion de votre iPhone pour créer un réseau privé instantané et gère la connexion pour vous via un menu interactif.

## ✨ Fonctionnalités Clés

-   **Zéro Configuration IP :** Détection automatique du serveur sur le réseau.
-   **Interface Interactive :** Un menu simple pour choisir entre le mode Client ou Serveur.
-   **Thème "Hacker" :** Change l'apparence du terminal pour une expérience immersive.
-   **Ultra-Léger :** Construit sans dépendances UI externes pour une performance maximale.
-   **Administration Facile :** Un panneau de contrôle intégré (`GoS login`) pour gérer le mot de passe et les clés du serveur.

## 🛠️ Outils Linux Requis

GoSpot agit comme un chef d'orchestre pour des outils Linux standards. Pour fonctionner, il a besoin de :
-   `openssh` (pour `ssh`, `sshd`, etc.)
-   `iproute2` (pour `ping`)

**Bonne nouvelle :** GoSpot vous aide à les installer ! La première fois que vous configurez le serveur, l'outil vous guidera.

## 🚀 Installation

L'installation se fait via `npm` (le gestionnaire de paquets de Node.js).

1.  **Prérequis :** Assurez-vous d'avoir `nodejs` et `npm` installés dans iSH :
    ```sh
    apk add nodejs npm
    ```

2.  **Installation de GoSpot :**
    Installez le package globalement avec cette commande unique :
    ```sh
    npm install -g gospot-ish
    ```

## 💡 Utilisation

### 1. Configuration du Serveur (Une seule fois)

Sur l'appareil qui **recevra** les connexions :

```sh
# Lance le panneau d'administration
GoS login
```
Dans le menu, choisissez l'option **1** pour définir un **mot de passe root**. Ce mot de passe sera demandé une seule fois par chaque nouveau client pour autoriser sa connexion.

### 2. Lancer une Connexion

Lancez simplement la commande `GoS` sur les deux appareils.

```sh
GoS
```

-   **Sur l'appareil Serveur :**
    1.  Activez le **Partage de connexion** dans les Réglages de l'iPhone.
    2.  Dans le menu GoS, choisissez **"Serveur"**. L'application se mettra en attente.

-   **Sur l'appareil Client :**
    1.  Connectez-vous au réseau Wi-Fi créé par le serveur.
    2.  Dans le menu GoS, choisissez **"Client"**. L'application trouvera le serveur et lancera la connexion.

## ⚖️ Licence

Ce projet est distribué sous la **Licence MIT**. Voir le fichier `LICENSE` pour plus de détails.
