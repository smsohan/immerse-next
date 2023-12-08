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
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:a4547477b69eced9ea4ed6a60f63cb1e3634db60bd56cd05b76dfbf58ceb67f7"
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
