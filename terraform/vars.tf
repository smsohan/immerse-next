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
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:99a8e3c13a953b13f24aaf9ef18594e1aca3af544e5e9328ac57ce7a75b5cfe5"
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
