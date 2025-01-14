export async function login(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const { token } = await response.json();
  return token;
}
