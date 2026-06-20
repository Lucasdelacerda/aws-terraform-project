resource "aws_db_subnet_group" "main" {
  name = "postgres-subnet-group"

  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]

  tags = {
    Name = "postgres-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "aws-terraform-db"

  engine = "postgres"

  instance_class = "db.t3.micro"

  allocated_storage = 20

  db_name  = "tasksdb"
  username = var.db_username
  password = var.db_password

  publicly_accessible = false

  skip_final_snapshot = true

  vpc_security_group_ids = [
    aws_security_group.rds_sg.id
  ]

  db_subnet_group_name = aws_db_subnet_group.main.name

  tags = {
    Name = "aws-terraform-db"
  }
}