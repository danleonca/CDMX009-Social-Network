//import { example } from './example.js';
//
//example();
let getEmail;
let getName;
let getImg;
let url;

// create new user start ******************************************************************************************************************************************************
let createNewuser = document.getElementById('createUserNw');
createNewuser.addEventListener('click', () => {
  let emailNew = document.getElementById('emailNw').value;
  let password = document.getElementById('passwordNw').value;
  document.getElementById('createUser').style.display = 'none';
  document.getElementById('logingUsers').style.display = 'block';
  firebase.auth().createUserWithEmailAndPassword(emailNew, password).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
});

let userNew = document.getElementById('newUser');
userNew.addEventListener('click', () => {
  document.getElementById('createUser').style.display = 'block';
  document.getElementById('logingUsers').style.display = 'none';
});

// login register users ********************************************************************************************************
let registeredUser = document.getElementById('logInUser');
registeredUser.addEventListener('click', () => {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {

    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
});

//login with socialmedia ***********************************************************************************************+++
let btnGoogle = document.getElementById('loginGoogle');
btnGoogle.addEventListener('click', logWithGoogle)
  
  function logWithGoogle(){
  let providerGoogle = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(providerGoogle)
};



let btnFacebook = document.getElementById('loginFacebook')
btnFacebook.addEventListener('click', () => {
  let providerFacebook = new firebase.auth.FacebookAuthProvider();
  return firebase.auth().signInWithPopup(providerFacebook)
});
let userSigned;
// active user ****************************************************************************************************************
function theWatcher() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log('active user');
      printSite();
      console.log(user)
      userSigned = firebase.auth().currentUser;
      console.log(userSigned.uid);
      if (userSigned != null) {
        userSigned.providerData.forEach(function (profile) {
          if (profile.displayName === null) {
            let showEmail = document.getElementById("sayHi");
            getEmail = profile.email;
            let showImage = document.getElementById('imgProfile');
            let photo = `<figure><img class = "imageBox" src="img/noprofile.png"></figure>`
            showEmail.innerHTML = 'Hola: ' + getEmail;
            showImage.innerHTML = photo;
          } else {
            let showName = document.getElementById('sayHi');
            let showImage = document.getElementById('imgProfile');
            getName = profile.displayName;
            let getImage = profile.photoURL;
            showName.innerHTML = 'Hola: ' + getName;
            let photo = `<figure><img class = "imageBox" src="${getImage}"></figure>`
            showImage.innerHTML = photo;
          }
        });
      }
    }
    else {
      console.log('no users logged');
    }
  });
};
theWatcher();

function printSite() {
  document.getElementById('firstPage').style.display = 'none';
  document.getElementById('allTheSite').style.display = 'block';
}

// user singout *****************************************************************************************************
let buttonClose = document.getElementById('logOut');
function signOut() {
  document.getElementById('firstPage').style.display = 'block';
  document.getElementById('allTheSite').style.display = 'none';
  //function closes(){
  firebase.auth().signOut()
    .then(function () {
      console.log('Out');
    })
    .catch(function (error) {
      console.log(error);
    })
}
buttonClose.addEventListener('click', signOut)

//***********************************FIRESTORE*******************************************
var db = firebase.firestore();

// get img and name *******************************************************************************************
let shareBtn = document.getElementById('btnShare');
shareBtn.addEventListener('click', () => {
  function getNameProfile() {
    var userSigned = firebase.auth().currentUser;
    if (userSigned != null) {
      userSigned.providerData.forEach(function (profile) {
        if (profile.displayName === null) {
          getName = profile.email;
          getImg = "img/noprofile.png"
        }
        else {
          getName = profile.displayName;
          getImg = profile.photoURL;
        }
      });
    }
  }
  getNameProfile()
  let date = new Date();
  date += Date.now();
  let date1 = date.slice(0, 25);
  let coment = document.querySelector('#text-box');
  console.log("post  " + coment.value);

  //  add comments in firestore***********************************************************************************************
 
  db.collection("publications").add({
    Name: getName,
    Photo: getImg,
    Date: date1,
    Comments: coment.value,
    Likes: 0,
    Image: url || '' ,
  })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
      console.log(coment.value);
      let coments = document.getElementById('text-box').value = " ";
      fileInput= " ";
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });


});
  //add image in firestorage *********************************************************************************************
  let fileInput = document.querySelector('#file');
  fileInput.onchange = e => {
    console.log(e.target.files);
    let file = e.target.files[0]
    firebase.storage().ref("images").child(file.name).put(file)
      .then(snap => {
        return snap.ref.getDownloadURL()
      })
      .then(link => {
        url = link
        let img = document.createElement('images')
        img.src = link
        document.body.appendChild(img)
      })
  }

//to print all the comments in real time******************************************************************************************
let printing = document.querySelector('#addComents');
db.collection("publications").orderBy("Date", "desc").onSnapshot((querySnapshot) => {
  printing.innerHTML = '',
    querySnapshot.forEach((doc) => {
      //console.log(doc)
      addNewCardNoComents(printing, doc); 
      


    });
  });
  let btnlike;
  let btnUnlike;
function addNewCard (printing, doc)  {
  let posting = document.createElement('div');
  let createTarget = `<div id="card2" class='allComents'>
<header class="styleNamePost">
 <img src="${doc.data().Photo}" class="imgProfilePost">
 <div class="nameDate"><strong>${doc.data().Name}</strong>
 <p> ${doc.data().Date}</p></div></header>
<p> ${doc.data().Comments}</p>
<p><img width="200" src="${doc.data().Image}"/></p>
<p> likes ${doc.data().Likes} </p> 
<img src="img/like.svg" name="${doc.id}" class="btnLike"> 
<button id="${doc.id}" class="btnUnLike">ya no me gusta</button>
<div class="like">
<button id="btnEdit"  class="btnStylesEdit" class="btnStyles">Edit</button>
<button id.="${doc.id}" class="btnStyles1">Borrar</button></div></div>`
  posting.innerHTML = createTarget;
  printing.appendChild(posting);  
  
  let btn2 = document.querySelectorAll('.btnStyles1');
  btn2.forEach(actionBtn => actionBtn.addEventListener("click", actionDelete))

   btnlike = document.querySelectorAll('.btnLike');
  btnlike.forEach(actionBtnLikes=> actionBtnLikes.addEventListener('click', addLikes));

   btnUnlike = document.querySelectorAll('.btnUnLike');
  btnUnlike.forEach(actionBtnUnlikes=> actionBtnUnlikes.addEventListener('click', removelikes));

  //let btnEdit= document.querySelectorAll('.btnStylesEdit');
  //btnEdit.forEach(actionEdit=> actionEdit.addEventListener('click', openModalEdit));  
}

function addNewCardNoComents (printing, doc)  {
  let posting = document.createElement('div');
  let createTarget = `<div id="card2" class='allComents'>
<header class="styleNamePost">
 <img src="${doc.data().Photo}" class="imgProfilePost">
 <div class="nameDate"><strong>${doc.data().Name}</strong>
 <p> ${doc.data().Date}</p></div></header>
<p> ${doc.data().Comments}</p>
<p><img width="200" src="${doc.data().Image}"/></p>
<p> likes ${doc.data().Likes} </p> 
<p><img src="img/like.svg" name="${doc.id}" class="btnLike"> 
`
  posting.innerHTML = createTarget;
  printing.appendChild(posting);  

  let btnlike = document.querySelectorAll('.btnLike');
  btnlike.forEach(actionBtnLikes=> actionBtnLikes.addEventListener('click', ver));

}



/////*********filtrado+++++´´´´´´¨¨¨¨ */
let goToPrincipal= document.querySelector('#allComents');
goToPrincipal.addEventListener('click', () => {
printing.style.display= 'block';
filterMyComents.style.display='none';
filterComents.style.display='none';
})

let filterComents= document.querySelector('#addFilters');
let filterMyComents= document.querySelector('#addMyComents');
let filterName= document.querySelector('#searchName');
let btnFilter=document.querySelector('#searchButtom1');
let btnMySite= document.querySelector('#myWall');


btnMySite.addEventListener('click', () => {
  console.log(filterName.value);
  filterMyComents.style.display= 'block';
  printing.style.display= 'none';
  filterComents.style.display='none';

db.collection('publications').where('Name', '==', getName ||  getEmail).onSnapshot((filters)=>{ 
  filterMyComents.innerHTML = '',        
  filters.forEach((doc) => {
            addNewCard(filterMyComents, doc);
            
          })
        })
  })

//filtrar usuarios
btnFilter.addEventListener('click', () => {
  console.log(filterName.value);
  filterMyComents.style.display= 'none';
  printing.style.display= 'none';
  filterComents.style.display='block';
db.collection('publications').where('Name', '==', filterName.value).onSnapshot((filters)=>{ 
  filterComents.innerHTML = '',        
  filters.forEach((doc) => {
    addNewCardNoComents(filterComents, doc);
          })
        }) 
  })
// le podemos poner estos para ordenar .orderBy("Date", "desc") pero el timepo real ya no agarra porque necesita un index

//**************************************DELETE */
  let actionDelete = (e)=>{
      db.collection("publications").doc(e.target.id).delete()
      .then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
    } 
      
//**********************************LIKES********
let idPost;
function ver(){
  idPost=e.target.name;
 let usuarioExistente = db.collection("likes").data().usuario;
 let likeExistente= db.collection("likes").data().publicación;
 if(usuarioExistente!==userSigned && likeExistente!==idPost){
addLikes;
 }
 if(usuarioExistente==userSigned && likeExistente==idPost){
   console.log('Ya diste like')
 }
}

let addLikes = (e)=> {
  idPost=e.target.name;
db.collection('publications').doc(idPost).update({
  Likes: firebase.firestore.FieldValue.increment(+1)
});
///////////// add postLikes/////
db.collection("likes").add(
  
  {usuario: userSigned.uid,
  publicación: idPost,
})
//.collection("rute").add({ruta: db.collection("publication").id,})
//esto debe ir en boton de likes
.then(function (docRef) {
  console.log("Document written with ID: ", docRef.id);
  //console.log(coment.value);
  //let coments = document.getElementById('text-box').value = " ";
  //fileInput= " ";
})
.catch(function (error) {
  console.error("Error adding document: ", error);
});
//////////////////////////////
//btnlike.disabled = true;
//btnUnlike.disable= false;
}


let removelikes  = (e)=> {
  db.collection('publications').doc(e.target.id).update({
    Likes: firebase.firestore.FieldValue.increment(-1)
  });
  btnlike.disabled = false;
  btnUnlike.disabled = true;
  }