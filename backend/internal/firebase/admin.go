package firebase

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var AuthClient *auth.Client

func InitFirebase() (*auth.Client, error) {
	credJSON, err := os.ReadFile("firebase-admin.json")
	if err != nil {
		log.Fatalf("Đọc file credentials thất bại: %v", err)
	}

	opt := option.WithAuthCredentialsJSON("json", credJSON)

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Khởi tạo Firebase thất bại: %v", err)
	}

	AuthClient, err = app.Auth(context.Background())
	if err != nil {
		log.Fatalf("Khởi tạo Firebase Auth thất bại: %v", err)
	}

	log.Println("Firebase Admin khởi tạo thành công")

	return AuthClient, nil
}
