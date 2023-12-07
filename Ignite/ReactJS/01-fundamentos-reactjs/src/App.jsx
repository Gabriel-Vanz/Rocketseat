import { Post } from "./Post";
import { Header } from "./components/Header";

import styles from "./App.module.css";
import "./global.css";
import { Sidebar } from "./components/Sidebar";

export function App() {
  return (
    <div>
      <Header />

      <div className={styles.wrapper}>
        <Sidebar />
        <Post 
          author="Gabriel Vanz"
          content="lorem ipsum dolor sit amet"
        />
      </div>
    </div>
  );
}

