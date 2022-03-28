import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
//line below used to be useHistory
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const { name, email, password, error, loading } = data;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setData({ ...data, error: null, loading: true }); //
    e.preventDefault();
    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required." });
    }
    //registering new user
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //once user is registered we send their information to firestore db
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        created_at: Timestamp.fromDate(new Date()),
        isOnline: true,
        //The line beginning with "uid" to line "isOnline" we are storing this
        //information to firestore
      });

      //Resetting the data state below
      setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      navigate("/");
      console.log(result.user);
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  console.log("Hello from Register");
  return (
    <section>
      <h3>Create an Account</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
        </div>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}

        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </div>
      </form>
    </section>
  );
}
