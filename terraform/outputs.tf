output "ecr_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "application_url" {
  description = "URL pública da aplicação"
  value       = "http://${aws_lb.main.dns_name}"
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
