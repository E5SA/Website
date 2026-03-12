# Terraform configuration to create the Lambda function and an HTTP API
# Initialize with `terraform init` and apply with `terraform apply`.

provider "aws" {
  region = var.aws_region
}

resource "aws_iam_role" "lambda_exec" {
  name = "contact_lambda_exec"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "contact" {
  function_name = "contactForm"
  filename      = "${path.module}/lambda.zip" # you must zip the lambda/ folder beforehand
  handler       = "handler.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec.arn
  environment {
    variables = {
      TELEGRAM_BOT_TOKEN = var.telegram_token
      TELEGRAM_CHAT_ID   = var.telegram_chat
    }
  }
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "contact-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integr" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.contact.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "post_contact" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integr.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_sns_topic" "alerts" {
  name = "ops-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_cloudwatch_metric_alarm" "high_rate" {
  alarm_name          = "contact-high-invocations"
  namespace           = "AWS/Lambda"
  metric_name         = "Invocations"
  dimensions = {
    FunctionName = aws_lambda_function.contact.function_name
  }
  statistic           = "Sum"
  period              = 300          # 5-minute window
  evaluation_periods  = 1
  threshold           = 100          # >100 calls in 5m
  comparison_operator = "GreaterThanThreshold"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "high_cost" {
  alarm_name          = "monthly-cost"
  namespace           = "AWS/Billing"
  metric_name         = "EstimatedCharges"
  dimensions = {
    Currency = "USD"
  }
  statistic           = "Maximum"
  period              = 21600        # 6-hour granularity
  evaluation_periods  = 1
  threshold           = var.budget_limit
  comparison_operator = "GreaterThanThreshold"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

output "api_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}