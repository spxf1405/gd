package logger

import (
	"os"

	"go.uber.org/zap"
)

var l *zap.Logger

// Init logger (call 1 lần ở main)
func Init() {
	var err error

	if os.Getenv("ENV") == "production" {
		l, err = zap.NewProduction()
	} else {
		l, err = zap.NewDevelopment()
	}

	if err != nil {
		panic(err)
	}
}

// Sync flush log
func Sync() {
	_ = l.Sync()
}

//
// ===== Wrapper functions =====
//

// Info log
func Info(msg string, fields ...zap.Field) {
	l.Info(msg, fields...)
}

// Error log
func Error(msg string, fields ...zap.Field) {
	l.Error(msg, fields...)
}

// Debug log (optional)
func Debug(msg string, fields ...zap.Field) {
	l.Debug(msg, fields...)
}

// Warn log (optional)
func Warn(msg string, fields ...zap.Field) {
	l.Warn(msg, fields...)
}

// Err helper (auto attach error)
func Err(msg string, err error, fields ...zap.Field) {
	l.Error(msg, append(fields, zap.Error(err))...)
}
