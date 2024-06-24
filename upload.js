const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function uploadFileToContainer(sasUrl, filePath) {
  try {
    // Parse the URL to extract the container name and the SAS token
    const url = new URL(sasUrl);
    const containerName = url.pathname.split("/")[1];

    console.log("Container Name:", containerName);

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

    console.log("Container URL:", containerClient.url);

    // Generate a unique blob name using UUID
    const uniqueBlobName = `${uuidv4()}${path.extname(filePath)}`;

    // Get the block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueBlobName);

    // Upload the file to the container
    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);

    console.log(
      `Upload block blob "${uniqueBlobName}" successfully`,
      uploadBlobResponse.requestId
    );

    // Construct the URL to access the uploaded image
    const imageUrl = blockBlobClient.url;
    console.log("Image URL:", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`);
    if (error.details) {
      console.error("RequestId:", error.details.requestId);
    }
    console.error("Timestamp:", new Date().toISOString());
    throw error; // Rethrow the error to handle it in the caller
  }
}

// Use your SAS URL here
const sasUrl = "Use your SAS URL here";

// Path to the file you want to upload
const filePath = "./hamada-2.jpeg";

uploadFileToContainer(sasUrl, filePath)
  .then((imageUrl) => {
    console.log("Image uploaded successfully.");
    console.log("Access the image at:", imageUrl);
  })
  .catch((err) => {
    console.error("Upload failed:", err.message);
  });
