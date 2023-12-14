"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import { SDK, useSdk } from "../sdk.gen";

export default function Home() {
  const fetch = async () => {
    const users = await SDK.getAllUsers();
    console.log({ users });
  };

  const { data, loading } = useSdk.getAllUsers();
  console.log({ data, loading });

  useEffect(() => {
    fetch();
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.grid}></div>
    </main>
  );
}
