"""
Unit tests for Phase 9 Cross-Border Country Adapters.
"""
from app.services.country_adapters import get_country_config, COUNTRY_REGISTRY

def test_get_country_config_defaults():
    config = get_country_config("IND")
    assert config.country_name == "India"
    assert config.currency_code == "INR"
    assert config.currency_symbol == "₹"

def test_get_country_config_brazil():
    config = get_country_config("BRA")
    assert config.country_name == "Brazil"
    assert config.currency_code == "BRL"
    assert config.currency_symbol == "R$"
    assert config.primary_language == "pt"

def test_get_country_config_south_africa():
    config = get_country_config("ZAF")
    assert config.country_name == "South Africa"
    assert config.currency_code == "ZAR"
    assert config.primary_language == "zu"

def test_get_country_config_unknown_fallback():
    config = get_country_config("UNKNOWN")
    assert config.country_code == "IND"
