resource "google_pubsub_topic" "todos_topic" {
  name = "todos-topic"
}

resource "google_pubsub_subscription" "todos_subscription" {
  name  = "todos-subscription"
  topic = google_pubsub_topic.todos_topic.name

  ack_deadline_seconds = 600

  push_config {
    push_endpoint = "${google_cloud_run_v2_service.immerse-next.uri}${var.pubsub_listen_path}"
  }
}