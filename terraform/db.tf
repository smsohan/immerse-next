resource "google_compute_network" "peering_network" {
  name                    = "private-network"
  auto_create_subnetworks = "false"
}

resource "google_compute_global_address" "private_ip_address" {
  name          = "private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.peering_network.id
}

resource "google_service_networking_connection" "default" {
  network                 = google_compute_network.peering_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

resource "google_sql_database_instance" "instance" {
  name             = "immerse-db-instance"
  region           = "us-central1"
  database_version = "MYSQL_8_0"

  depends_on = [google_service_networking_connection.default]

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled    = "true"
      private_network = google_compute_network.peering_network.id
    }
  }
  # set `deletion_protection` to true, will ensure that one cannot accidentally delete this instance by
  # use of Terraform whereas `deletion_protection_enabled` flag protects this instance at the GCP level.
  # deletion_protection = false
}

# resource "google_compute_network_peering_routes_config" "peering_routes" {
#   peering              = google_service_networking_connection.default.peering
#   network              = google_compute_network.peering_network.name
#   import_custom_routes = true
#   export_custom_routes = true
# }

resource "google_sql_database" "db" {
  name = "immerse_db"
  instance = google_sql_database_instance.instance.name
}

resource "google_sql_user" "iam_service_account_user" {
  name     = var.service-account
  instance = google_sql_database_instance.instance.name
  type     = "CLOUD_IAM_SERVICE_ACCOUNT"
}

resource "google_secret_manager_secret" "immerse_db_password" {
  secret_id = "immerse-db-password"
  replication {
    auto {}
  }
}
# resource "google_secret_manager_secret_version" "default" {
#   secret      = google_secret_manager_secret.immerse_db_password.secret_id
#   secret_data = "CHANGE ME"
# }

resource "google_secret_manager_secret_iam_member" "default" {
  secret_id = google_secret_manager_secret.immerse_db_password.id
  role      = "roles/secretmanager.secretAccessor"
  # Grant the new deployed service account access to this secret.
  member     = "serviceAccount:${var.service-account}"
  depends_on = [google_secret_manager_secret.immerse_db_password]
}

# resource "google_project_iam_member" "cloud_run_access" {
#   project = var.project
#   role = "roles/cloudsql.client"
#   member = "serviceAccount:${var.service-account}"
# }


## Uncomment this block after adding a valid DNS suffix

# resource "google_service_networking_peered_dns_domain" "default" {
#   name       = "example-com"
#   network    = google_compute_network.peering_network.name
#   dns_suffix = "example.com."
#   service    = "servicenetworking.googleapis.com"
# }

