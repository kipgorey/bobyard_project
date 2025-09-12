# config/env.py
import environ
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Create an env instance and read the .env file
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))