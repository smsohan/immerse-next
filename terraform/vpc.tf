
resource "google_compute_network" "vpc" {
  name = "immerse-next-vpc"
}

resource "google_compute_subnetwork" "subnet" {
  name          = "immerse-next-vpc-subnet"
  ip_cidr_range = "10.10.0.0/16"
  region        = var.region
  network       = google_compute_network.vpc.self_link
}