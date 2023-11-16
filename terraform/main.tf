provider "google" {
  project = "sohansm-project"
}

resource "google_cloud_run_service" "immerse-next" {
  name = "immerse-next"
  location = "us-west1"
  template {
    spec {
      containers {
        image = "us-west1-docker.pkg.dev/sohansm-project/cloud-run-source-deploy/immerse-next:latest
        resources {
          limits = {
            memory = "512Mi"
          }
        }
      }
    }
  }
}
