package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var l = zap.NewNop()

func Init() {
	var err error

	env := os.Getenv("ENV")

	if env == "production" {
		l, err = zap.NewProduction(
			zap.AddCaller(),
			zap.AddCallerSkip(1),
		)
	} else {
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

func Logger() *zap.Logger {
	return l
}

func Debug(msg string, fields ...zap.Field) {
	l.Debug(msg, fields...)
}

func Info(msg string, fields ...zap.Field) {
	l.Info(msg, fields...)
}

func Warn(msg string, fields ...zap.Field) {
	l.Warn(msg, fields...)
}

func Error(msg string, fields ...zap.Field) {
	l.Error(msg, fields...)
}

func Panic(msg string, fields ...zap.Field) {
	l.Panic(msg, fields...)
}

func Fatal(msg string, fields ...zap.Field) {
	l.Fatal(msg, fields...)
}
