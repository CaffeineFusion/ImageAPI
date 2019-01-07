# ImageAPI
This project is experimenting with different providers of cloud based web hooks and storage.  
[Note: This is in the very early stages of the experimentation and is not currently functional. The specs and approach may change without any notice.]  

The base use case is the ability to upload remote images into a cloud storage bucket as well as to retrieve and resize them.
(Note: some providers have resizing capabilities inbuilt [eg. GCP], this project will examine other methods to implement the same)

## API Requirements
- Upload Images via URI
- Download Images
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

## Leads
Consider spinning up app in Firebase
Resumable file uploads: https://cloud.google.com/storage/docs/json_api/v1/how-tos/resumable-upload
https://github.com/mkahn5/gcloud-resumable-uploads/blob/master/views/index.ejs
Google Websocket demo: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/websockets
Firebase approach to uploads: https://firebase.google.com/docs/storage/web/upload-files#monitor_upload_progress
Pub/Sub: https://github.com/googleapis/nodejs-pubsub/


## Questions
- How will client be informed of workerised file upload failure? Web Socket?  
- How do we provide information on file before it has been fully uploaded to the server?
- How to verify correct filetype?


## Architecture
The API endpoint footprint is small and doesn't need to maintain any state. This makes it a prime candidate for Lamba-style webhooks. (Benefits: Auto-scaling, minimal upkeep, smaller code footprint etc.)  
User will interact with a single REST endpoint (/images) through GET and PUT requests.  

![Image API GET sequence](/screenshots/doc_assets/GET.png)  

![Image API PUT sequence](/screenshots/doc_assets/PUT.png)

For Uploading the images, we need the PUT endpoint to initiate one or more upload operations. In this case, we'll trigger one or more instances of a Lambda function. (Phase 2 could utilize a Pub/Sub service with workers consuming the upload tasks - Beyond the scope of this demo)  


For real-time feedback on the upload process, we could have the client long-poll the GET status. However, because we want to have multiple image uploads of undefined size, a better approach would be to use a Web Socket where the client can be notified of status updates of each upload. This would also provide a means for real-time upload states - a chunked upload can provide %age upload completions to the client side in real-time.  
Two approaches could be used on POST - return a 101 status and direct the client to upgrade to a Websocket. Return a 102 status

### Provider
Note: GCP's Node 8 driver is still Beta.

### Components
2 External End Points - GET and PUT corresponding to:
3 Lambdas - GET, PUT, and uploadImage.
1 Data Store.

### Implementation
#### Item Expiry
The item expiry can be handled directly in the data bucket policy.
`gsutil mb --retention 80d gs://ImageAPI`
(For a more nuanced/extensible approach we could specify a more detailed lifecycle policy or have a lambda function launched via scheduled CRON job - eg. via cloud scheduler)

#### Resizing

Prepackaged Google solution:
https://medium.com/google-cloud/uploading-resizing-and-serving-images-with-google-cloud-platform-ca9631a2c556

#### Image Upload

### Known limitations
- File upload size limits ()

## Implementation Notes
### Code/Folder Structure - gcloud deploy limitations
The `gcloud deploy` command, unfortunately, appears to only work on a singular local index.js file (or remote repositories).
Rather than coalescing these into a single index file, the deployment script points to the remote locations in the Github repository. (Noted the issue with the documentation on this point.)

### (Prepackaged solutions)
Google's AppEngine provides ready made image servicing, including resizing and cropping.
https://cloud.google.com/appengine/docs/standard/python/refdocs/google.appengine.api.images#google.appengine.api.images.get_serving_url

### Performance considerations
#### HTTP Requests to Google Cloud
We're currently utilizing Google's prebuilt node module for access. For a smaller footprint, to aid with speed of load for the cloud functions, we could use a streamlined request library to interact directly with their REST API.  
