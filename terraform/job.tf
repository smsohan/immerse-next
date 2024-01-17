resource "google_cloud_run_v2_job" "immerse_next_job" {
  provider     = google-beta
  name         = "${var.name}-job"
  location     = var.region
  launch_stage = "BETA"

  template {
    template {
      containers {
        image = var.image
      }
    }
  }
}