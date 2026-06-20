resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/aws-terraform-backend"
  retention_in_days = 7
}