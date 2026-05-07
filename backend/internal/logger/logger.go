package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var l *zap.Logger

func Init() {
	var err error

	env := os.Getenv("ENV")

	if env == "production" {
		// ===== PRODUCTION =====
		l, err = zap.NewProduction(
			zap.AddCaller(),
			zap.AddCallerSkip(1),
		)
	} else {
		// ===== DEVELOPMENT (có màu) =====
		cfg := zap.NewDevelopmentConfig()

		cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
		cfg.EncoderConfig.EncodeCaller = zapcore.ShortCallerEncoder

		l, err = cfg.Build(
			zap.AddCaller(),
			zap.AddCallerSkip(1),
		)
	}

	if err != nil {
		panic(err)
	}
}

func Sync() {
	_ = l.Sync()
}

//
// ===== Wrapper =====
//

func Info(msg string, fields ...zap.Field) {
	l.Info(msg, fields...)
}

func Error(msg string, fields ...zap.Field) {
	l.Error(msg, fields...)
}

func Debug(msg string, fields ...zap.Field) {
	l.Debug(msg, fields...)
}

func Warn(msg string, fields ...zap.Field) {
	l.Warn(msg, fields...)
}

func Err(msg string, err error, fields ...zap.Field) {
	l.Error(msg, append(fields, zap.Error(err))...)
}
