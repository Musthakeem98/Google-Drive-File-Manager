const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = '863355816882-9qdl4bkgi8r5udc5d5i3hn1q85m81f70.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04VYRvh5KRtGpCgYIARAAGAQSNwF-L9IrkYeuRwWQx0H7wxuoLewP6uwfqaUlNM7z3ZJz7fYqwxfn7KxsM9LOGZlFnnc09qGm3kk';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});


const filePath = path.join(__dirname, 'code.pdf');

let dataID; // Declare the variable outside the function

async function uploadFile() {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: 'code.pdf', 
        mimeType: 'application/pdf', 
      },
      media: {
        mimeType: 'application/pdf', 
        body: fs.createReadStream(filePath),
      },
    });

    dataID = response.data.id; 

    console.log('File ID:', dataID);
    
  } catch (error) {
    console.log(error.message);
  }
}



// async function deleteFile() {
//      await generatePublicUrl(); 

//   try {
//     const response = await drive.files.delete({
//       fileId: dataID,
//     });
//     console.log(response.data, response.status);
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// deleteFile();

async function generatePublicUrl() {
  await uploadFile();
  try {
    const fileId = dataID ;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    /* 
    webViewLink: View the file in browser
    webContentLink: Direct download link 
    */
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

generatePublicUrl();
