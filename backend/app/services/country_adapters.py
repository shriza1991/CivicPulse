"""
country_adapters.py — Modular Country Adapter Registry

India (IND) is the primary demonstrated production context.
Brazil (BRA) and South Africa (ZAF) provide modular adapters demonstrating cross-border architectural portability.
"""
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

class CountryConfig(BaseModel):
    country_code: str
    country_name: str
    currency_code: str
    currency_symbol: str
    primary_language: str
    secondary_language: str
    default_lat: float
    default_lng: float
    administrative_term: str

COUNTRY_REGISTRY: Dict[str, CountryConfig] = {
    "IND": CountryConfig(
        country_code="IND",
        country_name="India",
        currency_code="INR",
        currency_symbol="₹",
        primary_language="hi",
        secondary_language="en",
        default_lat=19.0760,
        default_lng=72.8777,
        administrative_term="Ward / District"
    ),
    "BRA": CountryConfig(
        country_code="BRA",
        country_name="Brazil",
        currency_code="BRL",
        currency_symbol="R$",
        primary_language="pt",
        secondary_language="en",
        default_lat=-23.5505,
        default_lng=-46.6333,
        administrative_term="Distrito / Subprefeitura"
    ),
    "ZAF": CountryConfig(
        country_code="ZAF",
        country_name="South Africa",
        currency_code="ZAR",
        currency_symbol="R",
        primary_language="zu",
        secondary_language="en",
        default_lat=-26.2041,
        default_lng=28.0473,
        administrative_term="Municipal Ward"
    )
}

def get_country_config(country_code: str = "IND") -> CountryConfig:
    """Returns the CountryConfig adapter for the specified country code."""
    code = (country_code or "IND").upper()
    return COUNTRY_REGISTRY.get(code, COUNTRY_REGISTRY["IND"])

def list_supported_countries() -> List[CountryConfig]:
    """Returns list of all supported country configurations."""
    return list(COUNTRY_REGISTRY.values())

def format_currency(amount: float, country_code: str = "IND") -> str:
    """Formats a numerical budget into local currency notation."""
    config = get_country_config(country_code)
    return f"{config.currency_symbol}{amount:,.2f} ({config.currency_code})"
