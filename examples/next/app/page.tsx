"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import { SDK, useSdk, setSdkConfig } from "../sdk.gen";
import { io } from "socket.io-client";

setSdkConfig({ indexdbPrefix: "testActionApi" });

export default function Home() {
  const fetch = async () => {
    const users = await SDK.getAllUsers();
    console.log({ users });
  };

  const { data, loading, ...res } = useSdk.getAllProducts();
  console.log({ data, loading });

  useEffect(() => {
    // fetch();
    // const socket = io({ path: "/api/ws" });
    // socket.emit("action", { action: "getAllUsers" }, (e) => console.log({ e }));
    // socket.on("getAllUsers", ({ data }) => {
    //   console.log({ bingo: data });
    // });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.grid}>{loading ? "loading" : JSON.stringify(data)}</div>
    </main>
  );
}
