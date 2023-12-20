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
