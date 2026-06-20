resource "aws_ecr_repository" "backend" {
  name = "aws-terraform-backend"

  image_scanning_configuration {
    scan_on_push = true
  }

  force_delete = true

  tags = {
    Name = "aws-terraform-backend"
  }
}