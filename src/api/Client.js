import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const httpLink = new HttpLink({ uri: `http://localhost:8080/query` });

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
});

const uploadLink = createUploadLink({ uri: `http://localhost:8080/query` });

const client = new ApolloClient({
    link: ApolloLink.from([authLink, uploadLink]),
    cache: new InMemoryCache(),
});
  

export default client;
