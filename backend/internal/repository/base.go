// Package repository create new base repository
package repository

import (
	"backend/internal/db"
	"context"
)

type BaseRepository[T any] struct {
	DB *db.DB
}

func NewTestRepository[T any]() *BaseRepository[T] {
	return &BaseRepository[T]{}
}

func NewBaseRepository[T any](db *db.DB) *BaseRepository[T] {
	return &BaseRepository[T]{DB: db}
}

func (r *BaseRepository[T]) GetByID(ctx context.Context, query string, id any) (*T, error) {
	return nil, nil
}
