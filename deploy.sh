gsutil mb --retention 80d gs://image_api # need to provide a unique identifier

gcloud functions deploy getImage --source='src' --runtime=nodejs8 --trigger-http
gcloud functions deploy getImage --source='src/getImage.js' --runtime=nodejs8 --trigger-http
gcloud functions deploy getImage --source='src/postImage.js' --runtime=nodejs8 --trigger-http
# gcloud functions deploy image --trigger-http
# --trigger-bucket=ImageAPI

# Samples - https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/functions/imagemagick
# Samples - https://cloud.google.com/functions/docs/quickstart
