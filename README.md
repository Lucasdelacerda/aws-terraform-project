# TaskFlow — Aplicação Full Stack na AWS

Aplicação web para gerenciamento de tarefas, implantada na AWS com infraestrutura totalmente definida em Terraform.

**Aplicação:** [http://aws-terraform-alb-69891563.us-east-1.elb.amazonaws.com](http://aws-terraform-alb-69891563.us-east-1.elb.amazonaws.com)

## Visão geral

O projeto demonstra o provisionamento e a execução de uma aplicação completa em nuvem. O frontend e a API são distribuídos em um container no Amazon ECS com AWS Fargate, enquanto os dados são persistidos em uma instância PostgreSQL no Amazon RDS.

Toda a infraestrutura é reproduzível e versionada como código por meio do Terraform.

## Arquitetura

```text
Internet
   │
   ▼
Application Load Balancer
   │
   ▼
ECS Fargate ──────► CloudWatch Logs
   │
   ▼
Amazon RDS PostgreSQL
```

- O Application Load Balancer recebe as requisições públicas.
- O serviço ECS Fargate executa o container da aplicação.
- A imagem Docker é armazenada no Amazon ECR.
- O PostgreSQL opera em subnets privadas, sem acesso público.
- Os logs da aplicação são enviados ao Amazon CloudWatch.

## Tecnologias

### Aplicação

- HTML5, CSS3 e JavaScript
- Node.js 22
- Express
- PostgreSQL
- Docker

### Infraestrutura

- Terraform
- Amazon VPC
- Amazon ECS com AWS Fargate
- Amazon ECR
- Amazon RDS for PostgreSQL
- Application Load Balancer
- Amazon CloudWatch Logs
- AWS IAM

## Recursos provisionados

- VPC dedicada com faixa `10.0.0.0/16`
- Duas subnets públicas em zonas de disponibilidade distintas
- Duas subnets privadas para o banco de dados
- Internet Gateway e tabela de rotas pública
- Security Groups com acesso restrito entre as camadas
- Application Load Balancer com health check
- Cluster, serviço e task definition do ECS Fargate
- Repositório privado no Amazon ECR
- Instância PostgreSQL no Amazon RDS
- Grupo de logs no Amazon CloudWatch
- IAM Role para execução das tasks do ECS

## Segurança e rede

O Load Balancer é o único componente da aplicação que recebe tráfego público na porta 80. O container aceita conexões somente do Security Group do Load Balancer, e o RDS aceita conexões PostgreSQL somente do Security Group do ECS.

O banco não possui endpoint público e utiliza conexão SSL. Variáveis sensíveis, arquivos de state e configurações locais do Terraform não são versionados no repositório.

## API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica a disponibilidade da aplicação |
| `GET` | `/tasks` | Lista as tarefas cadastradas |
| `POST` | `/tasks` | Cadastra uma nova tarefa |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |

Exemplo de payload para criação:

```json
{
  "title": "Minha tarefa"
}
```

## Estrutura do projeto

```text
aws-terraform-project/
├── app/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── db.js
│   │   ├── package.json
│   │   └── server.js
│   └── frontend/
│       ├── index.html
│       ├── script.js
│       └── style.css
├── terraform/
│   ├── alb.tf
│   ├── cloudwatch.tf
│   ├── ecr.tf
│   ├── ecs.tf
│   ├── iam.tf
│   ├── rds.tf
│   ├── security-groups.tf
│   ├── subnets.tf
│   ├── variables.tf
│   └── vpc.tf
└── README.md
```

## Funcionalidades

- Cadastro de tarefas
- Listagem de tarefas persistidas
- Exclusão de tarefas
- Interface web responsiva
- Persistência em PostgreSQL
- Health check pelo Load Balancer
- Logs centralizados no CloudWatch

## Status

Aplicação implantada e operacional na região AWS `us-east-1`.
