import { FormEventHandler, useState } from "react";
import { Link, useNavigate } from "react-router";

import { signUp } from "../services/signupService";
import "./SignupPage.css";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await signUp(email, name, password);
      navigate("/login");
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <>
      {error && <h3>{error}</h3>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input type="submit" value="Signup" />
      </form>
      <Link to="/login">I already have an account</Link>
    </>
  );
};
