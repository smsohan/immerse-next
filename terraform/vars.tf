variable "service-account" {
  default = "1000276527499-compute@developer.gserviceaccount.com"
}
variable "region" {
  default = "us-central1"
}
variable "project" {
  default = "sohansm-project"
}
variable "image" {
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:6732f1c52f058d9d141fbbba7055add287aed8814b2c4f34c800f2d8b80bbf62"
}
variable "nginx-image" {
  default = "us-west1-docker.pkg.dev/sohansm-project/nginx/nginx@sha256:5700906e9effbb827aaba44ba6ab2cc8d6e6b923b027f697f40c50406666293a"
}
variable "mysql-user" {
  default = "immerse-db-user"
}
variable "name" {
  default = "immerse-next"
}
variable "underscored_name" {
  default = "immerse_next"
}
variable "domain" {
  default = "todo.smsohan.com"
}
variable "pubsub_listen_path" {
  default = "/api/todos/listen"
}
