import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
//line below used to be useHistory
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const { email, password, error, loading } = data;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setData({ ...data, error: null, loading: true }); //
    e.preventDefault();
    if (!email || !password) {
      setData({ ...data, error: "All fields are required." });
    }
    //signing in user
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      //once user is signed in we update their doc
      await updateDoc(doc(db, "users", result.user.uid), {
        //updating doc property isOnline as true
        isOnline: true,
      });
      console.log("You are logged in");

      //Resetting the data state below
      setData({
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
      <h3>Login to your account</h3>
      <form className="form" onSubmit={handleSubmit}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </section>
  );
}
