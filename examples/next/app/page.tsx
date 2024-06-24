"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import { SDK, useSdk, setSdkConfig } from "../sdk.gen";

setSdkConfig({ indexdbPrefix: "testActionApi", onComplete: (e) => console.log("completed") });

export default function Home() {
  const fetch = async () => {
    const users = await SDK.getAllUsers();
  };

  const { data, loading, ...res } = useSdk.getAllProducts();

  useEffect(() => {
    fetch();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.grid}>{loading ? "loading" : JSON.stringify(data)}</div>
    </main>
  );
}
