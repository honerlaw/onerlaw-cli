# Create Artifact Registry repository
resource "google_artifact_registry_repository" "repository" {
  location      = var.region
  repository_id = var.registry_name
  description   = "Docker repository for ${var.environment} environment"
  project       = var.project_id
  format        = "DOCKER"
}

# Create service account for pushing images
resource "google_service_account" "registry_sa" {
  account_id   = "${var.registry_name}-registry-sa"
  display_name = "Artifact Registry Service Account for ${var.registry_name}"
  project      = var.project_id
}

# Grant service account access to push/pull from Artifact Registry
resource "google_artifact_registry_repository_iam_member" "registry_writer" {
  project    = var.project_id
  location   = google_artifact_registry_repository.repository.location
  repository = google_artifact_registry_repository.repository.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.registry_sa.email}"
}

resource "google_artifact_registry_repository_iam_member" "registry_reader" {
  project    = var.project_id
  location   = google_artifact_registry_repository.repository.location
  repository = google_artifact_registry_repository.repository.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.registry_sa.email}"
}

# Create service account key for authentication
resource "google_service_account_key" "registry_key" {
  service_account_id = google_service_account.registry_sa.name
  public_key_type    = "TYPE_X509_PEM_FILE"
} 