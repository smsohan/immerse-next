provider "google" {
  project = "sohansm-project"
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
        env {
          name = "MYSQL_CONNECTION_NAME"
          value = google_sql_database_instance.db_instance.connection_name
        }
        env {
          name = "MYSQL_DB"
          value = google_sql_database.db.name
        }

      }
    }
  }
}
