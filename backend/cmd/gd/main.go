package main

import (
	"backend/internal/app"
	"backend/internal/auth"
	"backend/internal/firebase"
	"backend/internal/logger"
	"backend/internal/tournament"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/davecgh/go-spew/spew"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

func debugUnknownStruct(unknownData interface{}) {
	// 1. Nếu là Protobuf Message, convert ké qua Map trước
	if protoMessage, ok := unknownData.(proto.Message); ok {
		// Chuyển Protobuf thành chuỗi JSON thô (chưa cần format)
		marshaler := protojson.MarshalOptions{
			EmitUnpopulated: true, // Hiện cả các trường rỗng/mặc định
		}
		bytes, err := marshaler.Marshal(protoMessage)
		if err != nil {
			fmt.Printf("❌ Lỗi format Protobuf: %v\n", err)
			return
		}

		// Parse ngược chuỗi JSON đó vào một map trung gian
		var intermediateMap map[string]interface{}
		if err := json.Unmarshal(bytes, &intermediateMap); err != nil {
			fmt.Printf("❌ Lỗi Unmarshal sang Map: %v\n", err)
			return
		}

		// Giờ ném cái map sạch sẽ này vào spew.Dump để nó in từng dòng có màu sắc xịn sò
		fmt.Printf("\n--- [Protobuf Dump via Spew: %T] ---\n", protoMessage)
		spew.Dump(intermediateMap)
		fmt.Println("--------------------------------")
		return
	}

	// 2. Nếu là struct thường, vẫn dùng spew.Dump trực tiếp như cũ
	spew.Dump(unknownData)
}

func main() {
	godotenv.Load()

	prefix := "[backend]"

	logger.Init()
	defer logger.Sync()

	firebase.InitFirebase()
	ctx := context.Background()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"Origin",
			"User-Agent",
			"Referer",
			"Accept-Encoding",
			"Cache-Control",
			"Pragma",
			"Connect-Protocol-Version",
			"Connect-Timeout-Ms",
			"Connect-Accept-Encoding",
			"Connect-Content-Encoding",
			"Grpc-Timeout",
			"X-Grpc-Web",
			"X-User-Agent",
			"Grpc-Accept-Encoding",
			"Grpc-Encoding",
		},
		ExposedHeaders: []string{
			"Link",
			"Content-Type",
			"Content-Length",
			"Date",
			"Server",
			"Vary",
			"Content-Encoding",
			"Trailer",
			"Connect-Protocol-Version",
			"Connect-Content-Encoding",
			"Connect-Accept-Encoding",
			"Grpc-Status",
			"Grpc-Message",
			"Grpc-Status-Details-Bin",
		},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	infra := app.NewInfra(ctx)

	auth.Mount(r, infra)
	tournament.Mount(r, infra)

	addr := ":5000"
	fmt.Fprintln(os.Stdout, prefix, "Starting server on", addr)

	if err := http.ListenAndServe(addr, r); err != nil {
		fmt.Fprintln(os.Stderr, prefix, "❌ Server error:", err)
		os.Exit(1)
	}
}
