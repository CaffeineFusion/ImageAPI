# ImageAPI-GCP
This sub-project implements a basic Image management API in GCP. (index.js)   

Please note: `index.js` contains the latest functioning code. `experiments/` is from my initial experimentation and may not be functional.

## Current State
The first phase on this module has been completed.
This encompasses the basic functionality of uploading a remote image (via stream), and providing a signed URL by which to access that image. It consists of one REST end point.

## Setup
1. Create Project and add Project_ID to config.json   
2. Create a service account with access to upload Google Functions and save the key in keys/gcp_functions.json   
3. Create Bucket in Google Cloud Storage and update bucket_name in config.json  
4. Create a service account with write permissions to your google storage bucket and save the key in keys/gcp_storage.json  

## TODO
- Filetype verification
- Partitioned file uploads
- Caching
	- Match Cache expiry to Bucket item expiration
- Add script to deploy.sh to add Project_ID to bucket name
- Security and signing

## Implementation Notes
#### Item Expiry
The item expiry can be handled directly in the data bucket policy.
`gsutil mb --retention 80d gs://ImageAPI`
(For a more nuanced/extensible approach we could specify a more detailed lifecycle policy or have a lambda function launched via scheduled CRON job - eg. via cloud scheduler)

### GCP's Node 8 driver is still Beta.  

### Code/Folder Structure - gcloud deploy limitations  
The `gcloud deploy` command, unfortunately, appears to only work on a singular local index.js file (or remote repositories).

### (Prepackaged solutions)  
Google's AppEngine provides ready made image servicing, including resizing and cropping.
https://cloud.google.com/appengine/docs/standard/python/refdocs/google.appengine.api.images#google.appengine.api.images.get_serving_url
https://medium.com/google-cloud/uploading-resizing-and-serving-images-with-google-cloud-platform-ca9631a2c556

### Performance considerations
#### HTTP Requests to Google Cloud
We're currently utilizing Google's prebuilt node module for access. For a smaller footprint, to aid with speed of load for the cloud functions, we could use a streamlined request library to interact directly with their REST API.  


## Leads for future research
Consider spinning up app in Firebase
Resumable file uploads: https://cloud.google.com/storage/docs/json_api/v1/how-tos/resumable-upload
https://github.com/mkahn5/gcloud-resumable-uploads/blob/master/views/index.ejs
Google Websocket demo: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/websockets
Firebase approach to uploads: https://firebase.google.com/docs/storage/web/upload-files#monitor_upload_progress
Pub/Sub: https://github.com/googleapis/nodejs-pubsub/
