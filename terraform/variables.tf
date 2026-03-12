variable "aws_region" {
  description = "AWS region to deploy resources into"
  default     = null      # set to e.g. "us-east-1"
}

variable "telegram_token" {
  description = "Telegram bot token used by the Lambda"
  default     = null      # required for messaging
}

variable "telegram_chat" {
  description = "Chat ID where notifications should be sent"
  default     = null      # e.g. "-123456789"
}

variable "alarm_email" {
  description = "Email address to receive CloudWatch alarm notifications"
  default     = null      # set to your email to enable alerts
}

variable "budget_limit" {
  type        = number
  description = "Monthly cost threshold (USD) for billing alert"
  default     = null      # specify a number or leave null to disable
}
