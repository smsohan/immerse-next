provider "google" {
  project = "sohansm-project"
}

variable "service-account" {
  default = "1000276527499-compute@developer.gserviceaccount.com"
}
variable "region" {
  default = "us-central1"
}

variable "image" {
  default = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next@sha256:2cd47d6b8b1f09e62c6fcc0484e8ee338758c78196d002903ad78a45d286ea85"
}

resource "google_compute_network" "vpc" {
  name = "immerse-next-vpc"
}

resource "google_compute_subnetwork" "subnet" {
  name          = "immerse-next-vpc-subnet"
  ip_cidr_range = "10.10.0.0/16"
  region        = var.region
  network       = google_compute_network.vpc.self_link
}

# resource "google_vpc_access_connector" "connector" {
#   name          = "immerse-next-connector"
#   region        = var.region
#   network       = google_compute_network.vpc.name
#   ip_cidr_range = "10.8.0.0/28"
# }

resource "google_project_iam_binding" "binding" {
  project = "sohansm-project"
  role = "roles/redis.editor"
  members = [
    "serviceAccount:${var.service-account}"
  ]
}

resource "google_redis_instance" "redis" {
  name       = "immerse-next-redis"
  tier       = "STANDARD_HA"
  region   = var.region
  memory_size_gb = 1
  authorized_network = google_compute_network.vpc.self_link
}

resource "google_cloud_run_service" "immerse-next" {
  name = "immerse-next"
  location = var.region
  metadata {
    annotations = {
      "run.googleapis.com/launch-stage": "BETA"
    }
  }
  template {
    metadata {
      annotations = {
        "run.googleapis.com/network-interfaces" = "[{\"network\":\"${google_compute_network.vpc.name}\",\"subnetwork\":\"${google_compute_subnetwork.subnet.name}\"}]",
        "run.googleapis.com/vpc-access-egress": "private-ranges-only"
      }
    }
    spec {
      service_account_name  = var.service-account
      containers {
        image = var.image
        resources {
          limits = {
            cpu = "1000m"
            memory = "512Mi"
          }
        }
        env {
          name = "REDIS_HOST"
          value = google_redis_instance.redis.host
        }
        env {
          name = "REDIS_PORT"
          value = google_redis_instance.redis.port
        }
      }
    }
  }
}
