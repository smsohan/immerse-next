resource "google_pubsub_topic" "todos_topic" {
  name = "todos-topic"
}

resource "google_pubsub_subscription" "todos_subscription" {
  name  = "todos-subscription"
  topic = google_pubsub_topic.todos_topic.name

  ack_deadline_seconds = 600

  push_config {
    push_endpoint = "${google_cloud_run_v2_service.immerse-next.uri}${var.pubsub_listen_path}"
    oidc_token {
      service_account_email = var.service-account
      audience = google_cloud_run_v2_service.immerse-next.uri
    }
    attributes = {
      x-goog-version = "v1"
    }
  }
  depends_on = [google_cloud_run_v2_service.immerse-next]
}

resource "google_project_service_identity" "pubsub_agent" {
  provider = google-beta
  project  = data.google_project.project.project_id
  service  = "pubsub.googleapis.com"
}

resource "google_project_iam_binding" "project_token_creator" {
  project = data.google_project.project.project_id
  role    = "roles/iam.serviceAccountTokenCreator"
  members = ["serviceAccount:${google_project_service_identity.pubsub_agent.email}"]
}

resource "google_pubsub_topic_iam_binding" "pubsub_binding" {
  topic  = google_pubsub_topic.todos_topic.name
  role   = "roles/pubsub.publisher"
  members = [
    "serviceAccount:${var.service-account}"
  ]
}