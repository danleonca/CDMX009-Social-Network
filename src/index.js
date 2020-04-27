//import { example } from './example.js';
//
//example();
let getEmail;
let getName;
let getImg;
let url;

// create new user start ******************************************************************************************************************************************************
let createNewuser = document.getElementById("createUserNw");
createNewuser.addEventListener("click", () => {
  let emailNew = document.getElementById("emailNw").value;
  let password = document.getElementById("passwordNw").value;
  document.getElementById("createUser").style.display = "none";
  document.getElementById("logingUsers").style.display = "block";
  firebase
    .auth()
    .createUserWithEmailAndPassword(emailNew, password)
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

let userNew = document.getElementById("newUser");
userNew.addEventListener("click", () => {
  document.getElementById("createUser").style.display = "block";
  document.getElementById("logingUsers").style.display = "none";
});

// login register users ********************************************************************************************************
let registeredUser = document.getElementById("logInUser");
registeredUser.addEventListener("click", () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function () {})
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

//login with socialmedia ***********************************************************************************************+++
let btnGoogle = document.getElementById("loginGoogle");
btnGoogle.addEventListener("click", () => {
  let providerGoogle = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(providerGoogle);
});

let btnFacebook = document.getElementById("loginFacebook");
btnFacebook.addEventListener("click", () => {
  let providerFacebook = new firebase.auth.FacebookAuthProvider();
  return firebase.auth().signInWithPopup(providerFacebook);
});

// active user ****************************************************************************************************************
function theWatcher() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log("active user");
      printSite();
      var userSigned = firebase.auth().currentUser;
      if (userSigned != null) {
        userSigned.providerData.forEach(function (profile) {
          if (profile.displayName === null) {
            let showEmail = document.getElementById("sayHi");
            getEmail = profile.email;
            let showImage = document.getElementById("imgProfile");
            let photo = `<figure><img class = "imageBox" src="img/noprofile.png"></figure>`;
            showEmail.innerHTML = "Hola: " + getEmail;
            showImage.innerHTML = photo;
          } else {
            let showName = document.getElementById("sayHi");
            let showImage = document.getElementById("imgProfile");
            getName = profile.displayName;
            let getImage = profile.photoURL;
            showName.innerHTML = "Hola: " + getName;
            let photo = `<figure><img class = "imageBox" src="${getImage}"></figure>`;
            showImage.innerHTML = photo;
          }
        });
        cards();
      }
    } else {
      console.log("no users logged");
    }
  });
}
theWatcher();

function printSite() {
  document.getElementById("firstPage").style.display = "none";
  document.getElementById("allTheSite").style.display = "block";
}

// user singout *****************************************************************************************************
let buttonClose = document.getElementById("logOut");
function signOut() {
  document.getElementById("firstPage").style.display = "block";
  document.getElementById("allTheSite").style.display = "none";
  //function closes(){
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("Out");
    })
    .catch(function (error) {
      console.log(error);
    });
}
buttonClose.addEventListener("click", signOut);

//***********************************FIRESTORE*******************************************
var db = firebase.firestore();

// get img and name *******************************************************************************************
let shareBtn = document.getElementById("btnShare");
shareBtn.addEventListener("click", () => {
  function getNameProfile() {
    var userSigned = firebase.auth().currentUser;
    if (userSigned != null) {
      userSigned.providerData.forEach(function (profile) {
        if (profile.displayName === null) {
          getName = profile.email;
          getImg = "img/noprofile.png";
        } else {
          getName = profile.displayName;
          getImg = profile.photoURL;
        }
      });
    }
  }
  getNameProfile();
  let date = new Date();
  date += Date.now();
  let date1 = date.slice(0, 25);
  let coment = document.querySelector("#text-box");
  console.log("post  " + coment.value);

  //  add comments in firestore***********************************************************************************************

  db.collection("publications")
    .add({
      Name: getName,
      Photo: getImg,
      Date: date1,
      Comments: coment.value,
      Likes: "",
      Image: url,
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      console.log(coment.value);
      let coments = (document.getElementById("text-box").value = " ");
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
});
//add image in firestorage *********************************************************************************************
let fileInput = document.querySelector("#file");
fileInput.onchange = (e) => {
  console.log(e.target.files);
  let file = e.target.files[0];
  firebase
    .storage()
    .ref("images")
    .child(file.name)
    .put(file)
    .then((snap) => {
      return snap.ref.getDownloadURL();
    })
    .then((link) => {
      url = link;
      let img = document.createElement("images");
      img.src = link;
      document.body.appendChild(img);
    });
};

//to print all the comments in real time******************************************************************************************
let printing = document.querySelector("#addComents");
let cards = () => {
  db.collection("publications")
    .orderBy("Date", "desc")
    .onSnapshot((querySnapshot) => {
      (printing.innerHTML = ""),
        querySnapshot.forEach((doc) => {
          //console.log(doc)
          let posting = document.createElement("div");
          let createTarget = `<div id="card2" class='allComents'>
    <header class="styleNamePost">
     <img src="${doc.data().Photo}" class="imgProfilePost">
     <div class="nameDate"><strong>${doc.data().Name}</strong>
     <p> ${doc.data().Date}</p></div></header>
    <p id="areaComment"> ${doc.data().Comments}</p>
    <p><img width="300" src="${doc.data().Image}"/></p>
    <p> likes ${doc.data().Likes} </p> 
    <p><img src="img/like.svg" id="btnLike" class="btnStyles"> 
    <button id="${doc.id}" class="btnStylesEdit" class="btnStyles">Edit</button>
    <button id="${doc.id}" class="btnStyles1">Borrar</button></p></div>`;
          posting.innerHTML = createTarget;
          printing.appendChild(posting);

          //delete comments **************************************************************************************************************
          let btn2 = document.querySelectorAll(".btnStyles1");
          let actionDelete = (e) => {
            db.collection("publications")
              .doc(e.target.id)
              .delete()
              .then(function () {
                console.log("Document successfully deleted!");
              })
              .catch(function (error) {
                console.error("Error removing document: ", error);
              });
          };
          btn2.forEach((actionBtn) =>
            actionBtn.addEventListener("click", actionDelete)
          );

          // edit post ********************************************************************

          let btnEdit = document.querySelectorAll(".btnStylesEdit");

          let actionEdit = (e) => {
            let divNodeEdit = document.createElement("div");
            let boxEdit = `<div id="edit" class="divEdit"> 
         <textarea id="editText" cols="50" rows="5" placeholder="Editar Comentario"></textarea></div>`;
            divNodeEdit.innerHTML = boxEdit;
           posting.appendChild(divNodeEdit);

            return db
              .collection("publications")
              .doc(e.target.id)
              .update({
                Comments: comments,
              })
              .then(function () {
                console.log("Document successfully written!");
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
          };

          btnEdit.forEach((actionUpdate) =>
            actionUpdate.addEventListener("click", actionEdit)
          );
        });
    });
};
