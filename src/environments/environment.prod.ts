export const baseURL = "https://identitytoolkit.googleapis.com/v1/accounts:";
// export const APIKey = "key=AIzaSyDZRn9bJmR_Y71Jt3c7YCyfvhNRi32oxe8";

export const environment = {
  production: true,


  firebaseConfig: {
    apiKey: "AIzaSyAfqI2i6zQa7IW8ndGO1Gi2IVHSa35awuM",
  authDomain: "task-management-a3193.firebaseapp.com",
  projectId: "task-management-a3193",
  storageBucket: "task-management-a3193.appspot.com",
  messagingSenderId: "635031145935",
  appId: "1:635031145935:web:4021a13736f955420b96ba"
  },

  // API URLs Started ========
  signIn: `${baseURL}signInWithPassword?key=`,
  signUp: `${baseURL}signUp?key=`,
  forgetPassword: `${baseURL}sendOobCode?key=`,
  changePassword: `${baseURL}update?key=`,

};
