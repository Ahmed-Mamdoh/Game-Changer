function UserToken() {
  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const userData = JSON?.parse(userToken) || null;
  return userData;
}

export { UserToken };
