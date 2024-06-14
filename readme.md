# Google Drive API

A comprehensive Google Drive API project that mimics the functionality of Google Drive.
<img src="https://res.cloudinary.com/dbgnbrils/image/upload/v1718357768/Professional_LinkedIn_Banner_2_zfexfp.png" alt="image"/>
## Folder Structure

```plaintext
src
├── models
│   ├── user.model.js       // (userName, email, password, refreshToken, resetToken, resetTokenExpires)
│   ├── folder.model.js     // (owner, folderName, parentFolder, isTrashed, isStarred)
│   ├── file.model.js       // (owner, fileName, fileUrl, publicId, fileInfo, folderId, isStarred, isTrashed)
│   └── share.model.js      // (owner, sharedEmails, sharedType, sharedItems)
│
├── controllers
│   ├── user.controller.js      // (creatingUser, deletingUser, gettingUser, updatingUser) ---verified---
│   ├── folder.controller.js    // (creatingFolder, renamingFolder, deletingFolder, movingFolder, gettingFolder) ---verified---
│   ├── file.controller.js      // (creatingFiles, renamingFiles, deletingFiles, movingFiles, gettingFiles) ---verified---
│   ├── share.controller.js     // (sharing files/folders, getting shared files/folders with/by me) ---verified---
│   ├── trash.controller.js     // (transferring files/folders from one user to another) ---verified---
│   └── starred.controller.js   // (starring files/folders, getting/removing starred files/folders) ---verified---
│
├── db
│   └── index.js             // (Database configuration)
│
├── middleware
│   ├── auth.middleware.js      // (for protected routes) ---verified---
│   ├── multer.middleware.js    // (for uploading files) ---verified---
│   └── validator.middleware.js // (validating input fields while logging and registering) ---verified---
│
├── routes
│   ├── user.route.js           // (/register, /login, /logout, /getuser, /forget, /reset) ---verified---
│   ├── folder.route.js         // (/createfolder, /renamefolder, /deletefolder, /movefolder, /getfolder) ---verified---
│   ├── file.route.js           // (/createfile, /renamefile, /deletefile, /movefile, /getfile) ---verified---
│   ├── share.route.js          // (/share-item, /get-shared-items-by-me, /get-shared-items-with-me, /update-shared-by-me, /remove-shared-item) ---verified---
│   ├── trash.route.js          // (/move-to-trash, /get-trashed-items, /delete-trashed-items, /restore-trashed-items) ---verified---
│   └── starred.route.js        // (/add-to-starred, /get-starred-items, /remove-starred-items) ---verified---
│
├── utils
│   ├── cloudinary.js           // (cloudinary config and uploadFile function) ---verified---
│   ├── sendErrorResponse.js    // (for sending error response) ---verified---
│   ├── sendSuccessResponse.js  // (for sending success response) ---verified---
│   ├── generateMailLink.js     // (for generating mail link) ---verified---
│   └── nodemailer.js           // (for sending mail) ---verified---
│
├── validators
│   └── auth.validator.js       // (schema for validating input fields while logging and registering) ---verified---
│
├── app.js                      // (for starting server)
├── index.js                    // (entry point of server)
├── .env                        // (file for storing environment variables not pushed to GitHub)
└── .env.sample                 // (sample file for .env to be used by dev)
```

## Packages need to be installed:

```
npm install express cors dotenv cookie-parser cloudinary multer mongoose nodemailer jsonwebtoken zod bcrypt axios bcrypt
```

## Running the project:

```
npm run dev //nodemon to be installed
```
