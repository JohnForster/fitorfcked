import { FormEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthentication } from "../hooks/useAuthentication";

export const LoginPage = () => {
  const { loggedIn, authenticate } = useAuthentication();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/app");
      return;
    }
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await authenticate(email, password);
      navigate("/app");
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <>
      {error && <h3>{error}</h3>}
      <form onSubmit={handleSubmit}>
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
        <input type="submit" value="Log In" />
      </form>
    </>
  );
};
