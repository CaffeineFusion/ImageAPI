/** GCP example for reference
* https://cloud.google.com/storage/docs/uploading-objects#storage-upload-object-nodejs
**/

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Name of a bucket, e.g. my-bucket';
// const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';

// Uploads a local file to the bucket
await storage.bucket(bucketName).upload(filename, {
	// Support for HTTP requests made with `Accept-Encoding: gzip`
	gzip: true,
	metadata: {
		// Enable long-lived HTTP caching headers
		// Use only if the contents of the file will never change
		// (If the contents will change, use cacheControl: 'no-cache')
		cacheControl: 'public, max-age=31536000',
	},
});

console.log(`${filename} uploaded to ${bucketName}.`);

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const srcFilename = 'Remote file to download, e.g. file.txt';
// const destFilename = 'Local destination for file, e.g. ./local/path/to/file.txt';

const options = {
  // The path to which the file should be downloaded, e.g. "./file.txt"
  destination: destFilename,
};

// Downloads the file
await storage
  .bucket(bucketName)
  .file(srcFilename)
  .download(options);

console.log(
  `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
);
