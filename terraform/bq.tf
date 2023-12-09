resource "google_bigquery_dataset" "dataset" {
  dataset_id = "${var.underscored_name}_dataset"
  location   = var.region
}

# Create a table within the dataset
resource "google_bigquery_table" "table" {
  dataset_id = google_bigquery_dataset.dataset.dataset_id
  table_id   = "${var.underscored_name}_events"

  schema = <<EOF
  [
    {
      "name": "messageId",
      "type": "STRING",
      "mode": "REQUIRED"
    },
    {
      "name": "objectType",
      "type": "STRING",
      "mode": "REQUIRED"
    },
    {
      "name": "eventType",
      "type": "STRING",
      "mode": "REQUIRED"
    },
    {
      "name": "id",
      "type": "INTEGER",
      "mode": "REQUIRED"
    },
    {
      "name": "title",
      "type": "STRING",
      "mode": "NULLABLE"
    },
    {
      "name": "createdAt",
      "type": "TIMESTAMP",
      "mode": "REQUIRED"
    }
  ]
  EOF
}

resource "google_project_iam_member" "bq_access_sa" {
  project = var.project
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:${var.service-account}"
}

resource "google_project_iam_member" "bq_job_user_sa" {
  project = var.project
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${var.service-account}"
}

