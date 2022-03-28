import { AuthContext } from "../context/auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
  //no idea what the whole {component: Component, ...rest} stuff is about
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); //this is undefined currently

  console.log(user); //need to get user AuthContext to be truthy

  return user ? (
    navigate("/login")
  ) : (
    <>
      <h1>POTATOS</h1>
      <Component />
    </>
  );
}
