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
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:e75899315b3dd82ca2972b9914a594190de54b4ae2bc424149569df1df08bbb9"
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
