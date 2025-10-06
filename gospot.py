#!/usr/bin/env python3
import os
import sys
import subprocess
from time import sleep
from pathlib import Path

# =======================
# Styles et couleurs
# =======================
class Style:
    RED = '\033[91m'
    GREEN = '\033[92m'
    CYAN = '\033[96m'
    YELLOW = '\033[93m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_boxed(text, title="GoSpot Stall 🛠️"):
    """Affiche du texte dans une boîte style hacker"""
    border = "+" + "-"*(len(text)+4) + "+"
    print(Style.CYAN + border)
    print(f"|  {Style.BOLD}{text}{Style.END}{Style.CYAN}  |")
    print(border + Style.END)

# =======================
# Fonctions utilitaires
# =======================
def run_script(script_path):
    """Exécuter un script shell si existant"""
    if Path(script_path).exists():
        subprocess.run(["sh", script_path])
    else:
        print(Style.RED + f"[!] Script {script_path} introuvable" + Style.END)

def simple_exit():
    print(Style.RED + "\n[!] Arrêt du CLI" + Style.END)
    sys.exit(0)

# =======================
# Fonctions principales
# =======================
def start_client():
    print(Style.GREEN + "[*] Client démarré..." + Style.END)
    # Simulation client
    sleep(1)
    print(Style.CYAN + "[*] Connecté à un serveur GoSpot." + Style.END)
    sleep(1)

def start_server():
    print(Style.GREEN + "[*] Serveur démarré..." + Style.END)
    # Simulation serveur
    sleep(1)
    print(Style.CYAN + "[*] Serveur GoSpot prêt à accepter des clients." + Style.END)
    sleep(1)

def install_tools():
    print(Style.YELLOW + "[*] Installation des outils..." + Style.END)
    # Exemple d'installation (fictif)
    sleep(1)
    print(Style.GREEN + "[*] Outils installés." + Style.END)

def create_ssh_key():
    print(Style.YELLOW + "[*] Création d'une nouvelle clé SSH..." + Style.END)
    key_path = Path.home() / ".ssh" / "gosspot_key"
    os.makedirs(key_path.parent, exist_ok=True)
    if not key_path.exists():
        subprocess.run(["ssh-keygen", "-f", str(key_path), "-N", ""])
    print(Style.GREEN + f"[+] Clé SSH créée : {key_path}" + Style.END)

def admin_tools():
    print(Style.MAGENTA + "[*] Accès aux outils d'administration..." + Style.END)
    # Simulation admin
    sleep(1)
    print(Style.GREEN + "[*] Interface admin prête." + Style.END)

# =======================
# Menu principal
# =======================
def main_menu():
    os.system("clear")
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
        start_client()
    elif choice == "2":
        start_server()
    elif choice == "3":
        install_tools()
    elif choice == "4":
        create_ssh_key()
    elif choice == "5":
        admin_tools()
    elif choice == "6":
        simple_exit()
    else:
        print(Style.RED + "[!] Choix invalide" + Style.END)

    sleep(1.5)
    main_menu()

# =======================
# Entrée principale
# =======================
if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        simple_exit()
