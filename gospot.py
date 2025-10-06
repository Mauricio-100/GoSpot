#!/usr/bin/env python3
import os
import sys
import subprocess
from time import sleep

# Couleurs et style
class Style:
    RED = '\033[91m'
    GREEN = '\033[92m'
    CYAN = '\033[96m'
    YELLOW = '\033[93m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_boxed(text, title="GoSpot Stall 🛠️"):
    border = "+" + "-"*(len(text)+2) + "+"
    print(Style.CYAN + border)
    print(f"| {text} |")
    print(border + Style.END)

def run_node_script(script_name):
    """Si besoin, appeler encore le script Node.js"""
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    if not os.path.exists(script_path):
        print(Style.RED + f"Erreur: {script_name} introuvable" + Style.END)
        return
    subprocess.run(["node", script_path])

def main_menu():
    os.system('clear')
    print_boxed("GoSpot CLI - Version Python", title="GoSpot Hacker Edition")
    print(Style.CYAN + "\n--- Connexion ---" + Style.END)
    print("  1. Client (Rejoindre)")
    print("  2. Serveur (Partager)")
    print(Style.YELLOW + "\n--- Outils & SDK ---" + Style.END)
    print("  3. Installer les outils")
    print("  4. Créer une nouvelle clé SSH")
    print("  5. Administration du Serveur")
    print("\n  6. Quitter\n")

    choice = input(Style.CYAN + "Votre choix (1-6) : " + Style.END).strip()

    if choice == "1":
        print(Style.GREEN + "Démarrage du client..." + Style.END)
        run_node_script("client.js")
    elif choice == "2":
        print(Style.GREEN + "Démarrage du serveur..." + Style.END)
        run_node_script("partage.js")
    elif choice == "3":
        print(Style.YELLOW + "Installation des outils..." + Style.END)
        run_node_script("tools.sh")
    elif choice == "4":
        print(Style.YELLOW + "Création d'une nouvelle clé SSH..." + Style.END)
        run_node_script("ssh_tool.sh")
    elif choice == "5":
        print(Style.CYAN + "Administration du serveur..." + Style.END)
        run_node_script("login.sh")
    elif choice == "6":
        print(Style.RED + "Au revoir !" + Style.END)
        sys.exit(0)
    else:
        print(Style.RED + "Choix invalide !" + Style.END)
    
    sleep(1.5)
    main_menu()

if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\n" + Style.RED + "Arrêt du CLI" + Style.END)
        sys.exit(0)
