data "aws_ssm_parameter" "github_token" {
  name = "/github.com/daveygit2050/tokens/amplify"
}

resource "aws_amplify_app" "main" {
  name       = local.app_name
  repository = "https://github.com/daveygit2050/kow.london"

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        build:
          commands:
          - cd static
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
