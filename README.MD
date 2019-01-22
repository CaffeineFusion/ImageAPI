# ImageAPI
This project is experimenting with different providers of cloud based web hooks and storage.
Please see the [Phases](#phases) below to see the completion rates for various providers.

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

<a name="phases"/>

## Phases   

### Phase 1   

The goal of Phase 1 is to put together a basic upload/download API. It should be able to concurrently stream upload from a remote url. It should be able to provide both a stream download directly and a url-based access point.

GCP - *Complete*    
Bluemix - *In Progress*    
Azure - *Future*   
AWS - *Future*

### Phase X   
Websockets for large uploads
Security - OAuth + jwt
Reporting + External logging
Data Stream + Analytics
