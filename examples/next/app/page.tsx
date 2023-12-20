"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import { SDK, useSdk, setSdkConfig } from "../sdk.gen";

setSdkConfig({ indexdbPrefix: "testActionApi" });

export default function Home() {
  const fetch = async () => {
    const users = await SDK.getAllUsers();
    console.log({ users });
  };

  const { data, loading } = useSdk.getAllUsers();

  useEffect(() => {
    // fetch();
    const exampleSocket = new WebSocket("wss://3000.code.cloud.site.sa/websockets");
    exampleSocket.onopen = () => {
      console.log("ws opened on browser");
      exampleSocket.send("message");
    };

    exampleSocket.onmessage = (message) => {
      console.log(`message received`, message.data);
    };
    console.log({ exampleSocket });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.grid}>{loading ? "loading" : JSON.stringify(data)}</div>
    </main>
  );
}
