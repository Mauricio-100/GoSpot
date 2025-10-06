#!/usr/bin/env python3
import subprocess
import sys
import os

# Chemin vers ton index.js
index_js_path = os.path.join(os.path.dirname(__file__), 'index.js')

def run_gospot_js(*args):
    """
    Exécute le script index.js avec Node.js et passe les arguments
    """
    try:
        result = subprocess.run(
            ['node', index_js_path, *args],
            check=True,
            capture_output=True,
            text=True
        )
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print("Erreur lors de l'exécution de Node.js :")
        print(e.stderr)

if __name__ == "__main__":
    # Passe tous les arguments du script Python à index.js
    run_gospot_js(*sys.argv[1:])
