import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // Used to fetch data when the window has not loaded
    // Makes requests in the `getInitialProps` function
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // Used to fetch data when the window has loaded
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
