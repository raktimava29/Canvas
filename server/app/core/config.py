from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    MONGO_URI: str
    JWT_SECRET: str
    DB_NAME: str
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = ""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )
    
    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]

settings = Settings()