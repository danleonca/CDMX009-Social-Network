let allApp;
let createNewuser= document.getElementById('createUserNw');
createNewuser.addEventListener('click', () => {
  console.log('boton que funciona');
    let emailNew= document.getElementById('emailNw').value;
    let password= document.getElementById('passwordNw').value;
    document.getElementById('createUser').style.display = 'none';
    document.getElementById('logingUsers').style.display = 'block';
    firebase.auth().createUserWithEmailAndPassword(emailNew, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        
        // ...
      });
});

let userNew= document.getElementById('newUser');
userNew.addEventListener('click', () => {
  document.getElementById('createUser').style.display = 'block';
  document.getElementById('logingUsers').style.display = 'none';
});

let oldUser= document.getElementById('logInUser');
oldUser.addEventListener('click', () => {
  let email= document.getElementById('email').value;
  let password= document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);

    // ...
  });
});

function theWatcher(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log('usuario activo');
    printSite();
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
    console.log('no hay usuarios');
  }
});
};

theWatcher();

function printSite() {
document.getElementById('firstPage').style.display= 'none';
document.getElementById('allTheSite').style.display= 'block';
}   

let btnGoogle = document.getElementById('loginGoogle');
btnGoogle.addEventListener('click', ()=>{
  const provedorGoogle = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provedorGoogle).then(function(result){
        const nameUser = result.user.displayName;
        const imgProfile = result.user.photoURL;
        console.log(nameUser);
        console.log(imgProfile);

      });
});

 

let btnFacebook = document.getElementById('loginFacebook');
btnFacebook.addEventListener('click', () =>{
  const providerFacebook = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(providerFacebook).then(function(result){
    console.log(result.user);
  });

});

function inicializarFireBase(){
  let showName = document.getElementById('sayHi');
  let showImage = document.getElementById('imgProfile');
  firebase.auth().onAuthStateChanged(function (user){
    if(user){
      let getName = user.displayName;
      let getImage = user.photoURL;
      showName.innerHTML = '¡Hola ' + getName +'!';
      let photo=` <figure> <img class= "imageBox" src ="${getImage}"> </figure> ` 
      showImage.innerHTML=photo;
    }
  });
}

inicializarFireBase();



let buttonClose= document.getElementById('logOut');
buttonClose.addEventListener('click', () => { 
  document.getElementById('firstPage').style.display= 'block';
document.getElementById('allTheSite').style.display= 'none';
//function closes(){
  firebase.auth().signOut()
  .then(function(){
    console.log('Salir');
  })
  .catch(function(error){
    console.log(error);
  })
 
});


  
let publicationsDataBase = document.querySelector("#publication");
let addBtn=document.querySelector("#btnShare");
let form=document.querySelector("#add-comment-form");


//create publications
function renderPublications(doc){
  let li = document.createElement("li");
  let comment = document.createElement("span");
  let cross= document.createElement("comments");



  
  li.setAttribute("data-id",doc.id);
  comment.textContent=doc.data().comment;
  cross.textContent= "x";
 
 
  li.appendChild(comment);
  li.appendChild(cross);

 
 publicationsDataBase.appendChild(li);

 //deleting data
 cross.addEventListener("click", (e) => {
   e.stopPropagation();
   let id = e.target.parentElement.getAttribute("data-id");
   db.collection("publications").doc(id).delete();
 })

}

//Promise that brings the data from the Cloud Firestore
 db.collection("publications").get().then((snapshot)=>{
//console.log(snapshot.docs);
snapshot.docs.forEach(doc => {
  //console.log(doc.data());
  renderPublications(doc);
})
});

//saving data

form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('publications').add({
      comment: form.btnShare.value,
  });
  form.btnShare.value = '';
});



