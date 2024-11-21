import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * This function is used to upload a file to the Firebase Storage service. 
 * In the application, this function is used to upload the avatar image provided by users.
 * If the avatar is uploaded successfully, this function will return a URL for this avatar.
 * If upload failed due to some reasons, an error will be returned.
 * @async
 * @function uploadFile
 * @param {File} file - The file to be uploaded to the Storage service.
 * @returns {Promise}
 * @throws Will throw out an error if the upload is failed.
 */
const uploadFile = async (file) => {
    console.log(file.name);
    const date = new Date();
    const storageRef = ref(storage, `images/${date + file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        }, 
        (error) => {
            // Handle unsuccessful uploads
            reject("Somthing went wrong!" + error.code);
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
                console.log('File available at', downloadURL);
            });
        }
        );
                      
    });
}

/**
 * This is function is used call the REST service to fetch user data from Firestore database.
 * If the data extraction is successful, the user data will be returned.
 * If there is some issues(e.g. server issue, invalid uid), return null and an error is thrown out.
 * @async
 * @function getUserData
 * @param {string} uid 
 * @returns {Promise}
 * @throws Will throw out an error if extracting data is failed.
 */
export const getUserData = async (uid) => {
	// const docRef = doc(db, "users", uid);
	// const docSnap = await getDoc(docRef);

	// if (docSnap.exists()) {
	// 	console.log("User data:", docSnap.data());
	// 	return docSnap.data();
	// } else {
	// // docSnap.data() will be undefined in this case
	// 	console.log("No such User!");
    //     return null;
	// }

    return fetch(`${https://explorechinanow-backend.onrender.com}/auth/getUserData/${uid}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();
    })
    .catch(error => {
        console.error("Error fetching user data from server:", error);
        return null;
    });
}

/**
 * This function is used to call login service, with email and password as request body.
 * If login failed due to some issues(e.g. server issue, invalid email or password), an error thrown.
 * If login seuccessfully, user data will be returned as response.
 * @async
 * @functio loginService
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 * @throws Will throw out an error if login is failed.
 */
export const loginService = (email, password) => {
    return fetch('${https://explorechinanow-backend.onrender.com}/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then((data) => {
                throw new Error(data.message || "Login failed");
            });
        }
        return response.json();
    })
}

export default uploadFile;
