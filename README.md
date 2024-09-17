# actionAPI

An open-source solution developed by the Cloud Solutions' team at [SITE](https://site.sa/en). This package assists developers in generating SDKs for their applications and producing API Swagger documentation.

The package supports the following:

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)

## Features

- ### websockets:

  Developers can implement REST APIs like what they normally would. However, `actionAPI` will use socket under the hood to communicate with the client. When using [React](https://react.dev/), developers can also configure `GET` APIs (individualy or globally) to periodically fetch from the server. Hence, giving end-users real-time experience.

- ### SDK

  using `generateSDK()` , the library will generate two types of SDK:

  SDK as functions (e.g. `sdk.getProducts()`)

  SDH as React Hooks (e.g. `useSdk.getProducts()`) - generating hooks can be optionally truned off.

- ### Swagger Documentation
  `actionApi` will auto-generate swagger documentation as soon as developers writes new API in his application.

## Installation

```
npm i --save actionapi
```

## Usage

### 1- Setting Up Server

```
const { apiApp, apiRoutes } = require("actionapi");

const routes = apiRoutes();
const app = apiApp();
const testAction = () => ({ test: "alll" });
routes.get("/test", testAction);

app.generateDocs();
app.generateSDK();
app.use("/api", routes);
```

### 2- Using SDK without react hooks

```
import { SDK } from "../sdk.gen";

export default function App() {
  const fetch = async () => {
    const users = await SDK.getAllUsers();
  };

  useEffect(() => {
    fetch();
  }, []);

  ...
}


```

### 3- Using SDK with react hooks

```
import { SDK } from "../sdk.gen";

export default function App() {

  const { data, loading } = useSdk.getAllProducts();

  ...
}
```

### 4- Configuration

#### client-side configuration

```
import { setSdkConfig } from "../sdk.gen";

setSdkConfig({
    disableSocket: false, // Default false

    onStart: callback, // a callback to run before fetching..

    onSuccess: callback, // a callback to run after a successful fetch
    (200)..

    onFail: callback, // a callback to run after receiving a 500 network error..

    onComplete?: callback, // a callback to run everytime a fetch is complete..

    interval: 5000, // how much time bwtween subsequent fetches

    indexdbPrefix: "myAPP" // Defaults to undefined, an indexDB key to store the data recieved from SDK fetches.

    ...
})

```

#### server-side configuration

```
app.generateSDK({
    disableSocket: false,

    path: "/ws", // api path where socket will be listening

    sdkFolder: "actions", // path to where the genereated sdk file will be located
});
```
