function UserToken() {
  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const userData = JSON.parse(userToken || "{}");
  return userData;
}

export { UserToken };
