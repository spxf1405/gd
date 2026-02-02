package db

import (
	"context"
	"fmt"
	"net/url"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
	Pool *pgxpool.Pool
}

func PrintPgxPoolConfig(cfg *pgxpool.Config) {
	fmt.Println("=== PGX Pool Config ===")
	fmt.Println("ConnConfig.Host:", cfg.ConnConfig.Host)
	fmt.Println("ConnConfig.Port:", cfg.ConnConfig.Port)
	fmt.Println("ConnConfig.Database:", cfg.ConnConfig.Database)
	fmt.Println("ConnConfig.User:", cfg.ConnConfig.User)
	fmt.Println("ConnConfig.Password:", cfg.ConnConfig.Password)
	fmt.Println("ConnConfig.TLSConfig:", cfg.ConnConfig.TLSConfig != nil)

	fmt.Println("PoolConfig.MaxConns:", cfg.MaxConns)
	fmt.Println("PoolConfig.MinConns:", cfg.MinConns)
	fmt.Println("PoolConfig.MaxConnLifetime:", cfg.MaxConnLifetime)
	fmt.Println("PoolConfig.MaxConnIdleTime:", cfg.MaxConnIdleTime)
	fmt.Println("PoolConfig.HealthCheckPeriod:", cfg.HealthCheckPeriod)

	fmt.Println("PoolConfig.ConnConfig.RuntimeParams:", cfg.ConnConfig.RuntimeParams)
	fmt.Println("==========================")
}

func NewDB(ctx context.Context) (*DB, error) {
	DB_HOST := "aws-1-ap-southeast-1.pooler.supabase.com"
	DB_PORT := 5432
	DB_NAME := "postgres"
	DB_USER := url.QueryEscape("postgres.xjsdfdyieufpzmncwoir")
	DB_PASSWORD := url.QueryEscape("SyBNTWrJJQBBD4Qb")

	connStr := fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=%s",
		DB_USER,
		DB_PASSWORD,
		DB_HOST,
		DB_PORT,
		DB_NAME,
		"require",
	)

	fmt.Println("connStr", connStr)
	poolConfig, err := pgxpool.ParseConfig(connStr)

	if err != nil {
		fmt.Println("Parse error:", err)
		return nil, fmt.Errorf("unable to parse config: %w", err)
	}

	PrintPgxPoolConfig(poolConfig)

	poolConfig.MaxConnLifetime = time.Hour
	poolConfig.MaxConnIdleTime = 30 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		fmt.Println("Parse error:", err)
		return nil, fmt.Errorf("unable to create connection pool: %w", err)
	}
	fmt.Println("DB Created!")
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("unable to ping database: %w", err)
	}

	return &DB{Pool: pool}, nil
}
