import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return <h1>You are { !currentUser && "NOT" } signed in</h1>
};

LandingPage.getInitialProps = async ({ req }) => {
  const client = buildClient(req);
  const { data } = await client.get("/api/users/current-user");

  return data;
}

export default LandingPage;
