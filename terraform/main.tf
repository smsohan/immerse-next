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

resource "google_pubsub_topic_iam_binding" "pubsub_binding" {
  topic  = google_pubsub_topic.todos_topic.name
  role   = "roles/pubsub.publisher"
  members = [
    "serviceAccount:${var.service-account}"
  ]
}

resource "google_cloud_run_v2_service" "immerse-next" {
  name = "immerse-next"
  location = var.region
  launch_stage = "BETA"

  template {
    service_account = var.service-account

    # Use RevisionTemplate instead of deprecated template block
    containers {
      image = var.image

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

  }

  traffic {
    percent         = 100
     type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

}
