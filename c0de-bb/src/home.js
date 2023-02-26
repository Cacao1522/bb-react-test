import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "./fire";

const db = firebase.firestore();

export default function Home() {
  const mydata = [];
  const mydata2 = [];
  const [data, setData] = useState(mydata);
  const [data2, setData2] = useState(mydata2);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyId, setReplyId] = useState("");
  const [flag, setFlag] = useState(false);
  const [replyFlag, setReplyFlag] = useState(false);

  const onChangeName = (e) => {
    setName(e.target.value); //nameにテキストボックスの文を代入
  };
  const onChangeText = (e) => {
    setText(e.target.value); //textにテキストボックスの文を代入
  };
  const onChangeReplyName = (e) => {
    setReplyName(e.target.value); //nameにテキストボックスの文を代入
  };
  const onChangeReplyText = (e) => {
    setReplyText(e.target.value); //textにテキストボックスの文を代入
  };

  const addText = (e) => {
    const ob = {
      name: name,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      id: db.collection("mydata").doc(),
      reply: false,
    };

    ob.id.set(ob).then(() => {
      //mydataにobを追加
      setName(""); //テキストボックスをクリア
      setText("");
      setFlag(!flag);
      setMessage("投稿しました");
    });
  };

  const ReplyBotton = (id, reply) => { //返信ボタンが押されたらreplyフィールドを反転、idを保存.その後useEffect起動
    if (reply) {
      id.update({
        reply: false,
      }).then(() => {
        setReplyFlag(!replyFlag);
        setFlag(!flag);
      });
    } else {
      id.update({
        reply: true,
      }).then(() => {
        setReplyFlag(!replyFlag);
        setFlag(!flag);
      });
    }
    setReplyId(id);
  };

  const addReplyText = (e) => {
    const ob = {
      name: replyName,
      text: replyText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      id: replyId,
    };

    ob.id
      .collection("replyText")
      .add(ob)
      .then(() => {
        //mydataにobを追加
        setReplyName(""); //テキストボックスをクリア
        setReplyText("");
        setFlag(!flag);
        setMessage("返信しました");
      });
  };

  useEffect(() => {
    //初回と投稿ボタンが押されたときに実行（表示の更新）
    mydata.length = 0;
    mydata2.length = 0;
    let replyBotton = true;

    db.collection("mydata")
      .orderBy("timestamp", "asc")
      .get()
      .then((snapshot) => {
        //mydataコレクションを取得.投稿時間で昇順にソート.
        snapshot.forEach((document) => {
          const doc = document.data(); //docにフィールドの情報がまとめられたオブジェクトを代入

          if (replyBotton) {
            if (doc.reply) replyBotton = false;
            mydata.push(
              <div>
                <div>
                  名前:{doc.name}　
                  {new Date(doc.timestamp?.toDate()).toLocaleString()}　
                  <button onClick={() => ReplyBotton(doc.id, doc.reply)}>
                    返信
                  </button>
                </div>
                <div>{doc.text}</div>
              </div>
            );
          } else {
            mydata2.push(
              <div>
                <div>
                  名前:{doc.name}　
                  {new Date(doc.timestamp?.toDate()).toLocaleString()}　
                  <button onClick={() => ReplyBotton(doc.id, doc.reply)}>
                    返信
                  </button>
                </div>
                <div>{doc.text}</div>
              </div>
            );
          }
        }); //forEach(document)

        setData(mydata); //mydataをdataに代入
        setData2(mydata2); //mydataをdataに代入
        setMessage(
          "質問などあればお書きください" + mydata.length + mydata2.length
        );
      }); //snapshot
  }, [flag]);

  return (
    <div>
      <h3>C0de Web班掲示板 {message}</h3>
      {console.log(data)}
      <table>
        <thead>
          <tr>{data}</tr>
        </thead>
      </table>

      {replyFlag && (
        <div>
          <p>
            お名前
            <input
              type="text"
              value={replyName}
              maxLength="12"
              onChange={onChangeReplyName}
            />
          </p>
          <p>
            返信内容
            <input
              type="textarea"
              value={replyText}
              onChange={onChangeReplyText}
            />
          </p>
          <button onClick={addReplyText}>返信する</button>
        </div>
      )}

      <table>
        <thead>
          <tr>{data2}</tr>
        </thead>
      </table>

      <p>
        お名前
        <input
          type="text"
          value={name}
          maxLength="12"
          onChange={onChangeName}
        />
      </p>
      <p>
        このスレッドに書き込む
        <input type="textarea" value={text} onChange={onChangeText} />
      </p>
      <button onClick={addText}>投稿する</button>
    </div>
  );
}
