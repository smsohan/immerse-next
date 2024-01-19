
resource "google_project_iam_binding" "binding" {
  project = var.project
  role = "roles/redis.editor"
  members = [
    "serviceAccount:${var.service-account}"
  ]
}

resource "google_redis_instance" "redis" {
  name       = "${var.name}-redis"
  tier       = "STANDARD_HA"
  region   = var.region
  memory_size_gb = 1
  authorized_network = google_compute_network.vpc.self_link
}