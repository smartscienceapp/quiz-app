import sys
import os

# --- KODE GPS ---
# Ini memberitahu Python untuk melihat ke folder "bapaknya" (folder backend)
# supaya bisa menemukan file main.py, database.py, dll.
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

# --- IMPORT APP ---
from main import app

# Vercel butuh variable bernama 'app' ini agar server bisa jalan