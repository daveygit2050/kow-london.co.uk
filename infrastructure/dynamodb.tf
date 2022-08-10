resource "aws_dynamodb_table" "state_locking" {
  name = "kow-london.co.uk-state-locking"
  hash_key = "LockID"
  read_capacity = 1
  write_capacity = 1

  attribute {
    name = "LockID"
    type = "S"
  }
}
