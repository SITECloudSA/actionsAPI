"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import { SDK, setSdkConfig } from "../sdk.gen";

setSdkConfig({ baseUrl: "/api" });

export default function Home() {
  const fetch = async () => {
    const users = await SDK.getAllUsers();
    console.log({ users });
  };

  useEffect(() => {
    console.log("hereee");
    fetch();
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.grid}></div>
    </main>
  );
}
