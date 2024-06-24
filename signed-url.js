const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const accountName = 'YOUR_STORAGE_ACCOUNT_NAME';
const accountKey = 'YOUR_STORAGE_ACCOUNT_KEY';
const containerName = 'YOUR_CONTAINER_NAME';

const credential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, credential);

async function generateSignedUrl(blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Set the expiry time for the SAS URL (e.g., 1 hour from now)
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // Expires in 1 hour

  // Generate the SAS URL with write permissions and expiry time
  const sasUrl = blockBlobClient.generateSasUrl({
    permissions: 'write',
    expiresOn: expiryDate
  });

  return sasUrl;
}

module.exports = { generateSignedUrl };
