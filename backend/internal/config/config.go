package config

import (
	"fmt"
	"os"
	"time"
)

type DBConfig struct {
	DatabaseURL string
}

type OAuthConfig struct {
	GoogleClientID string
}

type AuthConfig struct {
	AccessTTL          time.Duration
	RefreshTTL         time.Duration
	AbsoluteSessionTTL time.Duration
	JWTSecret          string
}

type Config struct {
	Auth  AuthConfig
	DB    DBConfig
	OAuth OAuthConfig
}

func mustParseDuration(key string) time.Duration {
	val := os.Getenv(key)

	d, err := time.ParseDuration(val)
	if err != nil {
		panic(fmt.Sprintf("invalid duration for %s: %v", key, err))
	}

	return d
}

func LoadConfig() *Config {
	return &Config{
		Auth: AuthConfig{
			AccessTTL:          mustParseDuration("ACCESS_TTL"),
			RefreshTTL:         mustParseDuration("REFRESH_TTL"),
			AbsoluteSessionTTL: mustParseDuration("ABS_SESSION_TTL"),
			JWTSecret:          os.Getenv("JWT_SECRET"),
		},

		DB: DBConfig{
			DatabaseURL: os.Getenv("DATABASE_URL"),
		},

		OAuth: OAuthConfig{
			GoogleClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		},
	}
}
