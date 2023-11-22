## Useful commands

1. gcloud beta sql connect immerse-db-instance -u immerse-db-user
2. gcloud run services proxy immerse-next --region us-central1
3. ssh -L 8000:localhost:8080 sohan-glinux.c.googlers.com
4. gcloud beta run integrations create --type=custom-domains --parameters='set-mapping=todos.smsohan.com:immerse-next' --region us-central1
5. gcloud beta run integrations update custom-domain --parameters=mapping=todos.smsohan.com:immerse-next' --region us-central1