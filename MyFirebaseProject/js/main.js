'use strict';
const config = {
    apiKey: "AIzaSyBE3EVMus-fdY98en7HdmV1UZmRQ9Sat14",
    authDomain: "chatapp-dt1201.firebaseapp.com",
    databaseURL: "https://chatapp-dt1201.firebaseio.com",
    projectId: "chatapp-dt1201",
    storageBucket: "chatapp-dt1201.appspot.com",
    messagingSenderId: "720323939081"
  };
  firebase.initializeApp(config);

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});
// messages という Collection がなかった場合は新しく作ってくれる
const collection = db.collection('mxessages');

collection.add({
  message:'test'
})
.then(doc => {
  console.log(`${doc.id}.added!`)
})
.catch(error => {
  console.log(error);
});
