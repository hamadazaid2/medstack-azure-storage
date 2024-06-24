const { BlobServiceClient } = require("@azure/storage-blob");

async function listBlobsInContainer(sasUrl) {
  try {
    // Parse the URL to extract the container name and the SAS token
    const url = new URL(sasUrl);
    const containerName = url.pathname.split("/")[1];

    if (!containerName) {
      throw new Error(
        "Container name could not be determined from the SAS URL."
      );
    }

    // Create a BlobServiceClient using the base URL (without the container path) and the SAS token
    const baseUrl = `${url.protocol}//${url.host}`;
    const sasToken = url.search;
    const blobServiceClient = new BlobServiceClient(`${baseUrl}${sasToken}`);

    // Get the container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    console.log(`container: ${containerClient}`);

    // List all blobs in the container
    let blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob);
    }

    return blobs;
  } catch (error) {
    throw new Error(`Error listing blobs: ${error.message}`);
  }
}

// Use your SAS URL here
const sasUrl = "Use your SAS URL here";
listBlobsInContainer(sasUrl)
  .then((blobs) => {
    console.log("Blobs length: ", blobs.length);
    console.log("Blobs in container:");
    blobs.forEach((blob) => console.log(blob));
  })
  .catch((err) => {
    console.error(err.message);
  });
