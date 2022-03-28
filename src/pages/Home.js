import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
//onSnapshot is a realtime listener - checking user online or not.
//whereas getDocs works only once.
import { useEffect, useState } from "react";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "users");
    //create query object----line below queries users db EXCEPT for current logged in user
    const q = query(usersRef, where("uid", "not-in", [user1]));
    //execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => {
      unsub();
    };
  }, []);

  //selecting user from sidebar - when select a user it provides that user to chat State.
  const selectUser = async (user) => {
    setChat(user);
    console.log(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const messagesRef = collection(db, "messages", id, "chat");
    const q = query(messagesRef, orderBy("created_at", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });
    // console.log(messages);
    const docSnap = await getDoc(doc(db, "lastMessage", id));
    //If Statement below checks if the data is not equal to the currently logged in user.
    //If the message is sent by the other person then unread is update to false.
    if (docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, "lastMessage", id), {
        unread: false,
      });
    }
  };

  const user2 = chat.uid;
  const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    //can't use addDoc on id so had to make subcollection-"chat".
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      created_at: Timestamp.fromDate(new Date()),
    });
    //setDoc looks for doc id if existant and replaces it.
    //if no doc exists it makes a new one.
    await setDoc(doc(db, "lastMessage", id), {
      text,
      from: user1,
      to: user2,
      unread: true,
    });
    setText("");
  };

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3>
            </div>
            <div className="messages">
              {messages.length
                ? messages.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a user to start convo</h3>
        )}
      </div>
    </div>
  );
}
