import os

def load_prompt(filename: str) -> str:
    """Loads a prompt template from the backend/prompts/ directory."""
    # Resolves prompts relative to the backend workspace folder
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    path = os.path.join(base_dir, "prompts", filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read().strip()
    raise FileNotFoundError(f"Prompt file not found at: {path}")
