terraform {
  backend "s3" {
    bucket         = "kow-london.co.uk-state"
    key            = "tfstate"
    region         = "eu-west-2"
    dynamodb_table = "kow-london.co.uk-state-locking"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.25.0"
    }
  }
}
