resource "google_compute_global_address" "private_ip_address" {
  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.peering_network.id
}

resource "google_sql_database_instance" "db_instance" {
  name = "immerse-next"
  region = var.region
  database_version = "MYSQL_8_0"
  depends_on = [google_service_networking_connection.default]

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = false
      private_network = google_compute_network.peering_network.id
    }
  }
}

resource "google_sql_database" "db" {
  name = "immerse_db"
  instance = google_sql_database_instance.db_instance.name
}

resource "google_project_iam_member" "cloud_run_access" {
  project = var.project
  role = "roles/cloudsql.client"
  member = "serviceAccount:${var.service-account}"
}

