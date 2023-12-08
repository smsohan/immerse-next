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
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:3b3de27aee72467668f133e8f0362c36bce7c23b0afd24f0e61bdba34de055c4"
}
variable "mysql-user" {
  default = "immerse-db-user"
}

variable "name" {
  default = "immerse-next"
}

variable "domain" {
  default = "todo.smsohan.com"
}

variable "pubsub_listen_path" {
  default = "/api/todos/listen"
}
