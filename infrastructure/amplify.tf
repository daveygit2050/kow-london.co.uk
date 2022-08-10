data "aws_ssm_parameter" "github_token" {
  name = "/github.com/daveygit2050/tokens/kow-london-amplify"
}

resource "aws_amplify_app" "main" {
  name       = local.app_name
  repository = "https://github.com/daveygit2050/kow-london.co.uk"

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        build:
          commands:
          - cd backend
          - python3 --version
          - python3 -m pip install poetry
          - poetry install
          - poetry run python3 ./generate-events.py
          - cd ../static
          - rm -rf node_modules
          - npm install
          - npm run build
      artifacts:
        baseDirectory: static/dist/
        files:
        - '**/*'
      cache:
        paths: []
  EOT

  access_token = data.aws_ssm_parameter.github_token.value

  enable_auto_branch_creation = true
  enable_branch_auto_deletion = true

  auto_branch_creation_patterns = [
    "*",
    "*/**",
  ]
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.main.id
  branch_name = "main"
  stage       = "PRODUCTION"
}

resource "aws_amplify_domain_association" "main" {
  app_id      = aws_amplify_app.main.id
  domain_name = "kow-london.co.uk"

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}
