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
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:a09fb8d0220e8657640b55a2c11fedc1aa787a4cc52ac0fef7dc414eae4b700b"
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
