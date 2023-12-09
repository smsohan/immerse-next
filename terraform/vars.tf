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
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:d62e7c73b22c1714e019626fdaca44a5522762a3412252a3e1767513396f3cf2"
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
