// src/services/fileUploadService.js
import { google } from 'googleapis';

export async function uploadFileToDrive(auth, fileName, fileBuffer, mimeType) {
    const drive = google.drive({ version: 'v3', auth });

    try {
        const fileMetadata = {
            name: fileName
        };
        const media = {
            mimeType: mimeType,
            body: fileBuffer
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });

        // Make file public
        await drive.permissions.create({
            fileId: file.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const fileLink = `https://drive.google.com/uc?id=${file.data.id}&export=download`;
        return fileLink;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw error;
    }
}
