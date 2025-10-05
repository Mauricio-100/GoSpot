<div align="center">

```
 ____ ____ ____
/ ___/ ___/ ___|
| |  | |  | |___
| |__| |__|___  |
\____\____|____/
```

# GoSpot Suite

**La suite SSH tout-en-un pour iSH et environnements Linux. Zéro configuration IP, 100% en ligne de commande.**

<p>
    <a href="https://github.com/Mauricio-100/GoSpot/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licence MIT"></a>
    <a href="https://www.npmjs.com/package/gospot-ish"><img src="https://img.shields.io/npm/v/gospot-ish.svg" alt="Version NPM"></a>
    <img src="https://img.shields.io/badge/Made%20for-Linux%20&%20iSH-black?logo=linux&logoColor=white" alt="Fait pour Linux & iSH">
    <img src="https://img.shields.io/github/last-commit/Mauricio-100/GoSpot" alt="Dernier Commit">
</p>

</div>

---

GoSpot transforme la complexité des connexions SSH entre appareils mobiles en une expérience simple et élégante. Fini la chasse aux adresses IP locales ! GoSpot utilise le Partage de connexion de votre appareil pour créer un réseau privé instantané et orchestre la connexion via une interface interactive et immersive.

## 🏛️ Philosophie du Projet

GoSpot a été conçu avec trois principes fondamentaux :

1.  **💻 Pureté de la Ligne de Commande :** Tout doit pouvoir se faire depuis le terminal.
2.  **🪶 Légèreté Maximale :** Le moins de dépendances externes possible pour garantir la rapidité et la robustesse.
3.  **🧠 Intelligence Intégrée :** L'application doit être consciente de son environnement (détection d'OS, redondance des commandes) pour s'adapter à l'utilisateur, et non l'inverse.

## ✨ Fonctionnalités Clés

-   **🌐 Détection d'IP Dynamique et Redondante :** Tente plusieurs méthodes (`ifconfig`, `ip a`, `ping`) pour trouver le serveur de manière fiable.
-   **🖥️ Interface "Hacker" Immersive :** Change le thème du terminal pour une expérience utilisateur unique.
-   **⚙️ Architecture Modulaire 100% JavaScript :** Un code propre et maintenable, où chaque fichier a un rôle unique.
-   **🛰️ Conscience de la Plateforme :** Détecte la distribution Linux (iSH, Ubuntu, Kali...) et prépare le terrain pour une compatibilité future avec d'autres OS.
-   **🧰 SDK d'Outils Intégré :** Installe une suite complète d'outils réseau (`nmap`, `curl`, `ifconfig`...) en une seule commande.
-   **🔑 Gestionnaire SSH et DB :** Inclut des outils pour créer des clés SSH et se connecter à des bases de données distantes.

## 🚀 Installation & Utilisation

L'installation se fait via `npm`. GoSpot est conçu pour être aussi simple à installer qu'à utiliser.

### 1. Prérequis

Assurez-vous d'avoir `nodejs` et `npm` installés. Sur iSH ou une distribution Alpine :
```sh
apk add nodejs npm git
```

### 2. Installation de GoSpot

Installez le package globalement avec cette commande unique :
```sh
npm install -g gos/ish
```

### 3. Utilisation

Une fois installé, lancez simplement la commande `GoS` sur les deux appareils pour afficher le menu principal.

```sh
GoS
```

#### Premier Lancement (Configuration du Serveur)
Sur l'appareil qui **recevra** les connexions, lancez `GoS` et choisissez :
1.  **Option 3 : Installer les outils du SDK**.
2.  **Option 5 : Administration du Serveur**, puis définissez un mot de passe `root`.

#### Lancer une Connexion
-   **Sur l'appareil Serveur :**
    1.  Activez le **Partage de connexion** (Hotspot).
    2.  Dans le menu GoS, choisissez **"Serveur"**.

-   **Sur l'appareil Client :**
    1.  Connectez-vous au réseau Wi-Fi créé par le serveur.
    2.  Dans le menu GoS, choisissez **"Client"**.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une *issue* pour signaler un bug ou proposer une nouvelle fonctionnalité.

## ⚖️ Licence

Ce projet est distribué sous la **Licence MIT**. Voir le fichier `LICENSE` pour plus de détails.
