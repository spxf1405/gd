package user

import (
	userpb "backend/internal/gen/user/v1"
	"context"
	"fmt"
	"time"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

type UserServiceHandler struct {
	service *Service
}

func (s *UserServiceHandler) GetUserByID(
	ctx context.Context,
	req *connect.Request[userpb.GetUserByIDRequest],
) (*connect.Response[userpb.GetUserByIDResponse], error) {
	idReq := req.Msg.Id.GetValue()
	fmt.Println("GetUserByID")
	var user *userpb.User

	if idReq != 1 {
		user = nil
	}

	user = &userpb.User{
		Id:        wrapperspb.String("1"),
		Name:      wrapperspb.String("PNS"),
		CreatedAt: timestamppb.New(time.Now()),
		SecretKey: wrapperspb.String("303"),
	}

	res := connect.NewResponse(&userpb.GetUserByIDResponse{
		User: user,
	})
	return res, nil
}

func (s *UserServiceHandler) GetUserByName(
	ctx context.Context,
	req *connect.Request[userpb.GetUserByNameRequest],
) (*connect.Response[userpb.GetUserByNameResponse], error) {
	name := req.Msg.Name.GetValue()

	var user *userpb.User

	if name != "PNS" {
		user = nil
	} else {
		user = &userpb.User{
			Id:        wrapperspb.String("1"),
			Name:      wrapperspb.String("PNS"),
			CreatedAt: timestamppb.New(time.Now()),
			SecretKey: wrapperspb.String("303"),
		}
	}

	res := connect.NewResponse(&userpb.GetUserByNameResponse{
		User: user,
	})
	return res, nil
}
