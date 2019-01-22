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

## Architecture
The API endpoint footprint is small and doesn't need to maintain any state. This makes it a prime candidate for Lamba-style webhooks. (Benefits: Auto-scaling, minimal upkeep, smaller code footprint etc.)  
User will interact with a single REST endpoint (/images) through GET and PUT requests.  

![Image API GET sequence](/doc_assets/GET.png)  

![Image API PUT sequence](/doc_assets/PUT.png)

## Providers - Development State
### Phase 1 Complete - Upload, Download
- GCP - Google Cloud Platform

### Phase 1 In Progress
- Bluemix - IBM Cloud

### Future
- Azure
- AWS
