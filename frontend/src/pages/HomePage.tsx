// type HomePageProps = {};
import { useNavigate } from "react-router";
import "./HomePage.css";
// export const HomePage = (props: HomePageProps) => {
export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="rampart-one-regular main-title">
        GET FIT
        <br />
        <span className="or">or</span>
        <br />
        GET F*CKED
      </h1>
      <div className="button-row">
        <button onClick={() => navigate("/login")}>Log In</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </>
  );
};
