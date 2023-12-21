resource "google_project_service" "monitoring" {
  project = var.project
  service = "monitoring.googleapis.com"
}

resource "google_project_iam_binding" "metrics" {
  project = var.project
  role = "roles/monitoring.metricWriter"
  members = [
    "serviceAccount:${var.service-account}"
  ]
}

resource "google_secret_manager_secret" "prometheus_config" {
  secret_id = "prometheus_config"
  replication {
    auto{}
  }

  labels = {
    env = "production"
  }

}

resource "google_secret_manager_secret_version" "prometheus_config_version" {
  secret = google_secret_manager_secret.prometheus_config.id

  secret_data = file("./monitoring.yaml")
}
