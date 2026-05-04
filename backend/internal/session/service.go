package session

type Service struct {
	repo *SessionRepository
}

func NewService(repo *SessionRepository) *Service {
	return &Service{repo: repo}
}
