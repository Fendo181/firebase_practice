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
const collection = db.collection('messages');

// formから受け取った値を取得する
const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');

// 入力した値を表示する
collection.orderBy('created').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const li = document.createElement('li');
      li.textContent = change.doc.data().message;
      // messages に対して、子要素として li を追加
      messages.appendChild(li);
    }
  });
});

form.addEventListener('submit', e => {
  //  e.preventDefault(); でページ遷移しないようにする
  e.preventDefault();

  // 入力したデータを検査する
  const val = message.value.trim();
  if (val === "") {
    // 空文字の場合は処理をしない。
    alert('空文字を入力しないで下さい');
    return;
  }

  // 入力値を空にする
  message.value = '';
  message.focus();

  // 保存する
  collection.add({
      message: val,
      created: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(doc => {
      console.log(`${doc.id}.added!`)
    })
    .catch(error => {
      console.log(error);
    });
});

message.focus();
