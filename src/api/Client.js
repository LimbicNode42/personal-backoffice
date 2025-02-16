import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

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

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
  

export default client;
