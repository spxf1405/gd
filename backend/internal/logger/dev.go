package logger

import (
	"encoding/json"
	"fmt"

	"github.com/davecgh/go-spew/spew"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

// Dump nhận bất kỳ kiểu dữ liệu nào (interface{}), tự nhận diện và in xuống dòng sạch sẽ
func Dump(data interface{}) {
	fmt.Println("\n📸 [DEBUG DUMP] ---------------------------------------------")

	// 1. Kiểm tra nếu là Protobuf, dọn rác hệ thống trước khi Dump
	if protoMsg, ok := data.(proto.Message); ok {
		marshaler := protojson.MarshalOptions{
			EmitUnpopulated: true, // Hiện đầy đủ các trường false/0/rỗng
		}
		bytes, err := marshaler.Marshal(protoMsg)
		if err == nil {
			var cleanMap map[string]interface{}
			if err := json.Unmarshal(bytes, &cleanMap); err == nil {
				spew.Dump(cleanMap)
				fmt.Println("------------------------------------------------------------")
				return
			}
		}
	}

	// 2. Nếu là struct thường, map, slice, string... thì dùng spew gốc trực tiếp
	spew.Dump(data)
	fmt.Println("------------------------------------------------------------")
}
