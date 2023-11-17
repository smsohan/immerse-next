set -e
set -x

gcloud builds submit --config cloudbuild.yaml
pushd .
cd terraform && terraform apply -auto-approve
popd