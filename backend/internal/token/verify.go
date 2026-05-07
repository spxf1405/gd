package token

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`

	jwt.RegisteredClaims
}

func VerifyAccessToken(
	tokenString string,
	secret string,
) (*Claims, error) {

	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, errors.New("invalid claims")
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
