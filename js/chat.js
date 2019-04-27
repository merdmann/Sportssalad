let userName = "";
let userEmail = "";

var database = firebase.database();

function Hallo(x) {
    console.log(x);
}


function login() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // The signed-in user info.
      var user = result.user;
      console.log("Login successful!");
      console.log(user.displayName);
      userName = user.displayName;
      console.log(user.email);
      userEmail = user.email;
      getPosts();
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

function writeNewPost() {
  console.log("in write post");
  const userInput = document.querySelector("input").value;

  // A post entry.
  var postData = {
    author: userName,
    body: userInput,
    date: new Date().toISOString()
  };

  console.log(postData);

  // Get a key for a new Post.
  var newPostKey = firebase
    .database()
    .ref()
    .child("posts")
    .push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates["/posts/" + newPostKey] = postData;

  firebase
    .database()
    .ref()
    .update(updates);

  // getPosts();
}

function getPosts() {
  const postsDiv = document.querySelector("#posts");

  firebase
    .database()
    .ref("posts")
    .on("value", function(data) {
      console.log(data.val());

      const allPosts = data.val();

      let template = "";
      for (key in allPosts) {
        console.log(allPosts[key].author);
        template += `
          <div>
            <p>Author: ${allPosts[key].author}</p>
            <p>Message: ${allPosts[key].body}</p>
            <p>Date: ${allPosts[key].date}</p>
          </div>
        `;
      }

      postsDiv.innerHTML = template;
    });
}
