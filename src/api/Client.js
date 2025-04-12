import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// const blogLink = new HttpLink({ uri: `http://localhost:8080/blog` });
const blogUploadLink = createUploadLink({ uri: `http://localhost:8080/blog` });
const datasetsLink = new HttpLink({ uri: `http://localhost:8080/datasets` });

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
    link: ApolloLink.from([
      authLink, 
      split(
        ({ operationName }) => {
          return operationName && operationName.includes("Post");
        },
        blogUploadLink,    // for operations like BlogCreatePost, Posts, PostDetail
        datasetsLink  // everything else
      )
    ]),
    cache: new InMemoryCache(),
});
  

export default client;
