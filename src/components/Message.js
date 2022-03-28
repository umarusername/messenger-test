import Moment from "react-moment";
import { useRef, useEffect } from "react";

export default function Message({ msg, user1 }) {
  const scrollRef = useRef();

  //useEffect below handles automatic scrolling to latest messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    //rendering text boxes conditionally
    <div
      className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
      ref={scrollRef}
    >
      {/* //rendering text boxes conditionally */}
      <p className={msg.from === user1 ? "me" : "friend"}>
        {msg.text}
        <br />
        <small>
          <Moment fromNow>{msg.created_at.toDate()}</Moment>
        </small>
      </p>
    </div>
  );
}

// {msg.media ? <img src={msg.media} alt={msg.text}/> : null}
