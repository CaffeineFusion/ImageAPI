# ImageAPI
This project is experimenting with different providers of cloud based web hooks and storage.  
[Note: This is in the very early stages of the experimentation and is not currently functional. The specs and approach may change without any notice.]  

The base use case is the ability to upload remote images into a cloud storage bucket as well as to retrieve and resize them.
(Note: some providers have resizing capabilities inbuilt [eg. GCP], this project will examine other methods to implement the same)

## API Requirements
- Upload Images via URL
- Download Images / provide Signed URL
- Resize Images
- 80 day expiry

### Additional Considerations
- Real time updates for large uploads
- Performance [Optimization for write heavy load]
- Caching
- Security [Who can access which images]
- Resilience []

## Setup
1. Create Project.
2. Add Project_ID to config.json
TODO: add script to deploy.sh to add Project_ID to bucket name

### Service Accounts

## Leads
Consider spinning up app in Firebase
Resumable file uploads: https://cloud.google.com/storage/docs/json_api/v1/how-tos/resumable-upload
https://github.com/mkahn5/gcloud-resumable-uploads/blob/master/views/index.ejs
Google Websocket demo: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/websockets
Firebase approach to uploads: https://firebase.google.com/docs/storage/web/upload-files#monitor_upload_progress
Pub/Sub: https://github.com/googleapis/nodejs-pubsub/


## TODO
- Filetype verification
- Partitioned file uploads
- Caching
	- Match Catch expiry to Bucket item expiration

## Architecture
The API endpoint footprint is small and doesn't need to maintain any state. This makes it a prime candidate for Lamba-style webhooks. (Benefits: Auto-scaling, minimal upkeep, smaller code footprint etc.)  
User will interact with a single REST endpoint (/images) through GET and PUT requests.  

![Image API GET sequence](/doc_assets/GET.png)  

![Image API PUT sequence](/doc_assets/PUT.png)


### Provider
Note: GCP's Node 8 driver is still Beta.

### Implementation
#### Item Expiry
The item expiry can be handled directly in the data bucket policy.
`gsutil mb --retention 80d gs://ImageAPI`
(For a more nuanced/extensible approach we could specify a more detailed lifecycle policy or have a lambda function launched via scheduled CRON job - eg. via cloud scheduler)


## Implementation Notes
### Code/Folder Structure - gcloud deploy limitations
The `gcloud deploy` command, unfortunately, appears to only work on a singular local index.js file (or remote repositories).

### (Prepackaged solutions)
Google's AppEngine provides ready made image servicing, including resizing and cropping.
https://cloud.google.com/appengine/docs/standard/python/refdocs/google.appengine.api.images#google.appengine.api.images.get_serving_url
https://medium.com/google-cloud/uploading-resizing-and-serving-images-with-google-cloud-platform-ca9631a2c556

### Performance considerations
#### HTTP Requests to Google Cloud
We're currently utilizing Google's prebuilt node module for access. For a smaller footprint, to aid with speed of load for the cloud functions, we could use a streamlined request library to interact directly with their REST API.  
