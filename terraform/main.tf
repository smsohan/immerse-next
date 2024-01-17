terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "5.7.0"
    }
  }
}
provider "google" {
  project = var.project
}

provider "google-beta" {
  project = var.project
}

resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_kms_key_ring" "terraform_state" {
  name     = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  location = "us"
}

resource "google_kms_crypto_key" "terraform_state_bucket" {
  name            = "test-terraform-state-bucket"
  key_ring        = google_kms_key_ring.terraform_state.id
  rotation_period = "86400s"

  lifecycle {
    prevent_destroy = false
  }
}
data "google_project" "project" {
}

resource "google_project_iam_member" "storage" {
  project = var.project
  role    = "roles/cloudkms.cryptoKeyEncrypterDecrypter"
  member  = "serviceAccount:service-${data.google_project.project.number}@gs-project-accounts.iam.gserviceaccount.com"
}

resource "google_storage_bucket" "tfstate" {
  name          = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
  encryption {
    default_kms_key_name = google_kms_crypto_key.terraform_state_bucket.id
  }
  uniform_bucket_level_access = true
  depends_on = [
    google_project_iam_member.storage
  ]
}

resource "google_cloud_run_service_iam_binding" "invoker" {
  location = google_cloud_run_v2_service.immerse-next.location
  service  = google_cloud_run_v2_service.immerse-next.name
  role     = "roles/run.invoker"
  members  = ["serviceAccount:${var.service-account}"]
}

#run.googleapis.com/startupProbeType: Default
resource "google_cloud_run_v2_service" "immerse-next" {
  name = var.name
  location = var.region
  provider = google-beta
  launch_stage = "BETA"
  template {
    service_account = var.service-account
    execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
    # labels = {
    #    "run.googleapis.com/startupProbeType" = "Default"
    # }
    containers {
      name = "nginx"
      depends_on = [ var.name ]
      image = var.nginx-image
      ports {
        name = "http1"
        container_port = 8080
      }
      resources {
        limits = {
          cpu = "1000m"
          memory = "512Mi"
        }
      }
      startup_probe {
        timeout_seconds = 240
        period_seconds = 240
        failure_threshold = 1
        tcp_socket {
          port = 8080
        }
      }

    }

    containers {
      name = var.name
      image = var.image

      startup_probe {
        timeout_seconds = 240
        period_seconds = 240
        failure_threshold = 1
        tcp_socket {
          port = 8888
        }
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      volume_mounts {
        name       = "secrets"
        mount_path = "/secrets"
      }

      resources {
        limits = {
          cpu = "2000m"
          memory = "1Gi"
        }
      }
      env {
        name = "PORT"
        value = "8888"
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
        name = "MYSQL_DB"
        value = google_sql_database.db.name
      }
      env {
        name = "MYSQL_USER"
        value = var.mysql-user
      }
      env {
        name = "MYSQL_PASSWORD_FILE"
        value = "/secrets/immerse-db-password"
      }
      env {
        name = "MYSQL_SOCKET"
        value = "/cloudsql/${google_sql_database_instance.instance.connection_name}"
      }
      env {
        name = "PROJECT_ID"
        value = var.project
      }
      env {
        name = "PUBSUB_TOPIC"
        value = google_pubsub_topic.todos_topic.name
      }
      env {
        name = "BQ_API_ENDPOINT"
        value = ""
      }
      env {
        name = "BQ_DATASET_ID"
        value = google_bigquery_dataset.dataset.dataset_id
      }
      env {
        name = "BQ_TABLE_ID"
        value = google_bigquery_table.table.table_id
      }
    }

    containers {
      name = "collector"
      image = "us-docker.pkg.dev/cloud-ops-agents-artifacts/cloud-run-gmp-sidecar/cloud-run-gmp-sidecar:1.0.0"
      depends_on = [var.name]

      resources {
        limits = {
          cpu = "1000m"
          memory = "512Mi"
        }
      }

      volume_mounts {
        name       = "prometheus_config"
        mount_path = "/etc/rungmp/"
      }

    }

    vpc_access{
      network_interfaces {
        network = google_compute_network.vpc.name
        subnetwork = google_compute_subnetwork.subnet.name
      }
      egress = "PRIVATE_RANGES_ONLY"
    }
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.instance.connection_name]
      }
    }

    volumes {
      name = "secrets"
      secret {
        secret = google_secret_manager_secret.immerse_db_password.secret_id
        items {
          version = "latest"
          path    = "immerse-db-password"
          mode    = 0 # use default 0444
        }
      }
    }

    volumes {
      name = "prometheus_config"
      secret {
        secret = google_secret_manager_secret.prometheus_config.secret_id
        items {
          version = "latest"
          path    = "config.yaml"
          mode    = 0 # use default 0444
        }
      }
    }

  }

  traffic {
    percent         = 100
     type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
  depends_on = [ google_pubsub_topic_iam_binding.pubsub_binding,
    google_project_iam_member.bq_access_sa,
    google_project_iam_member.bq_job_user_sa,
    google_project_service.monitoring,
    google_project_iam_binding.metrics
  ]

}
