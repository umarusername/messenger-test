import { onSnapshot, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function User({ user, selectUser, user1, chat }) {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMessage", id), (doc) => {
      setData(doc.data());
    });
    //unsubscribing from realtime listener.
    return () => unsub();
  }, []);
  console.log(data);
  //should log the last message sent.

  return (
    //The chat 2 lines down is the "selected_user". This is the chat highlight functionality.
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => {
          selectUser(user);
        }}
      >
        <div className="user_info">
          <div className="user_detail">
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {/* Line below shows most recent sent message truncated under the selected user. */}
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Me" : null}</strong>
            {data.text}
          </p>
        )}
      </div>
      {/* <div onClick={() => {
        selectUser(user);
      }}></div> */}
    </>
  );
}
