package app

import (
	"backend/internal/db"
	"context"
	"log"

	"buf.build/go/protovalidate"
)

type Infra struct {
	DB        *db.DB
	Validator protovalidate.Validator
}

func NewInfra(ctx context.Context) *Infra {
	dbConn, err := db.NewDB(ctx)
	if err != nil {
		log.Fatal(err)
	}

	validator, err := protovalidate.New()
	if err != nil {
		log.Fatal(err)
	}

	return &Infra{
		DB:        dbConn,
		Validator: validator,
	}
}
