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

// Firebase 認証
const auth = firebase.auth();
let me = null;

// formから受け取った値を取得する
const message = document.getElementById('message');
const form = document.querySelector('form');
const messages = document.getElementById('messages');
const login = document.getElementById('login');
const logout = document.getElementById('logout');

// 認証処理
login.addEventListener('click', () => {
  auth.signInAnonymously();
});

logout.addEventListener('click', () => {
  auth.signOut();
});

// ログイン状態を監視する
auth.onAuthStateChanged(user => {
  if (user) {
    me =  user;
    // ログイン後にメッセージをクリアする
    // messages の最初の子要素が存在する限り messages から messages の最初の子要素を削除していく
    while(messages.firstChild){
      messages.removeChild(messages.firstChild);
    }

    // コレクションの監視
    collection.orderBy('created').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const li = document.createElement('li');
          const d = change.doc.data();
          li.textContent = d.uid.substr(0,8) + ':' + d.message;
          // messages に対して、子要素として li を追加
          messages.appendChild(li);
        }
      });
    }, error => {});
    console.log(`Logged in as : ${user.id}`);
    login.classList.add('hidden');
    // 他のhiddenクラスが入っているクラスを全て外す
    [logout, form, message].forEach(el => {
      el.classList.remove('hidden');
    });
    message.focus();
    return;
  }
  me =  null;
  console.log('NoBody is logged in');
  login.classList.remove('hidden');
  // 他のhiddenクラスが入っているクラスを全て外す
  [logout, form, message].forEach(el => {
    el.classList.add('hidden');
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
      created: firebase.firestore.FieldValue.serverTimestamp(),
      // meがnullだったら、nobodyが入るようにする
      uid:me ? me.uid : 'nobody',
    })
    .then(doc => {
      console.log(`${doc.id}.added!`)
    })
    .catch(error => {
      console.log(error);
      console.log('document add erro!');
    });
});
