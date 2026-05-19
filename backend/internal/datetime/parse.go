package datetime

import (
	"backend/internal/logger"
	"time"

	"go.uber.org/zap"
)

func MustParseTime(
	value string,
	layout string,
) time.Time {

	parsedTime, err := time.Parse(layout, value)
	if err != nil {
		logger.Panic(
			"Failed to parse time",
			zap.String("value", value),
			zap.String("layout", layout),
			zap.Error(err),
		)
	}

	return parsedTime
}
