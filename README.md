# TaskFlow na AWS com Terraform

Aplicação full stack de tarefas implantada na AWS. O frontend HTML/CSS/JavaScript e a API Node.js/Express rodam no mesmo container no **ECS Fargate**; os dados ficam no **PostgreSQL RDS**.

## Arquitetura

Internet → Application Load Balancer (2 subnets públicas) → ECS/Fargate → RDS PostgreSQL (2 subnets privadas). Os logs do container são enviados ao CloudWatch. A imagem Docker fica no ECR.

Recursos provisionados: VPC, Internet Gateway, quatro subnets em duas zonas de disponibilidade, route table, security groups, ALB, ECR, ECS/Fargate, IAM, RDS e CloudWatch Logs.

## Pré-requisitos

- AWS CLI configurado (`aws configure`)
- Terraform 1.5+
- Docker Desktop em execução
- Permissões AWS para criar os recursos descritos acima

## Deploy

Execute a partir da raiz do repositório no PowerShell:

```powershell
cd terraform
Copy-Item terraform.tfvars.example terraform.tfvars
# Edite terraform.tfvars e defina uma senha forte
terraform init
terraform apply -auto-approve

$ECR = terraform output -raw ecr_repository_url
$REGISTRY = $ECR.Split('/')[0]
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $REGISTRY

cd ..\app
docker build -f backend/Dockerfile -t aws-terraform-backend .
docker tag aws-terraform-backend:latest "${ECR}:latest"
docker push "${ECR}:latest"

cd ..\terraform
aws ecs update-service --cluster aws-terraform-cluster --service backend-service --force-new-deployment --region us-east-1
aws ecs wait services-stable --cluster aws-terraform-cluster --services backend-service --region us-east-1
terraform output -raw application_url
```

Abra a URL exibida no último comando. O primeiro deploy pode levar alguns minutos enquanto o RDS, o ALB e o serviço ECS ficam disponíveis.

> O primeiro `terraform apply` cria o serviço antes de existir uma imagem no ECR. Isso é esperado: depois do `docker push`, o `update-service` inicia a task com a imagem publicada.

## API

- `GET /health` — health check do ALB
- `GET /tasks` — lista tarefas
- `POST /tasks` — cria uma tarefa (`{"title":"Minha tarefa"}`)
- `DELETE /tasks/:id` — remove uma tarefa

## Verificação e diagnóstico

```powershell
curl "$(terraform output -raw application_url)/health"
aws ecs describe-services --cluster aws-terraform-cluster --services backend-service --region us-east-1
aws logs tail /ecs/aws-terraform-backend --follow --region us-east-1
```

## Destruir a infraestrutura

Para evitar custos depois da apresentação:

```powershell
cd terraform
terraform destroy -auto-approve
```

## Roteiro curto para o vídeo

1. Mostrar frontend, backend e arquivos Terraform no GitHub.
2. Mostrar `terraform output application_url` e a aplicação aberta.
3. Criar e excluir uma tarefa, recarregar a página e evidenciar a persistência no RDS.
4. Mostrar no console AWS o ECS/Fargate, RDS, Load Balancer e logs do CloudWatch.
