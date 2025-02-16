import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: `https://keycloak.wheeler-network.com`,
  realm: "shadow",
  clientId: `api-dev-site`,
});

export default keycloak;
