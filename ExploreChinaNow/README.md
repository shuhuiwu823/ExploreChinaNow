# Welcome to ExploreChinaNow Introduction Page!
## Introduction
Our product—a web-based travel assistant—offers streamlined support tailored to the needs of general users. 
By simply connecting their Google account, users can access a wealth of crucial information related to traveling in China, helping them anticipate and avoid potential problems. 
The app includes the following main functions:         
1. video search and recommandation.
2. AI based travel plan gerateration.
3. Google Map based province and hot city overview.
4. Blog sharing.
5. Introduciton of Visa Policy and Payment setup.
6. Email & password registeration and login.
7. Login with Google.  
## How to run the application locally
### For Development
cd to the right directory     
```npm install```     
```npm run dev-server```

in another terminal     
```npm run db-server```

in another terminal   
```npm run dev```

### For Production
cd to the right directory  
```npm run build```   
```npm start```

# Structure of Firebase Database
Authentication: Store the user account info, eg. E-mail, password, id.      
Firestore Database: Store structured data, eg. text, number.       
Storage: Store unstructured data, eg. image, video.
