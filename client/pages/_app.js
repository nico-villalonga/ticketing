import "bootstrap/dist/css/bootstrap.css";

import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => (
  <div>
    <h1>Header. {currentUser.email}</h1>
    <Component {...pageProps} />
  </div>
);

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx.req);
  const { data } = await client.get("/api/users/current-user");
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return{
    pageProps,
    ...data,
  };
}

export default AppComponent;
