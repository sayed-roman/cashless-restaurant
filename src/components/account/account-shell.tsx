import type { ReactNode } from "react";
import { AccountSidebar } from "./account-sidebar";
import styles from "./dashboard.module.css";
export function AccountShell({ name, children }: { name: string; children: ReactNode }) {
  return <div className={styles.shell}><AccountSidebar name={name} /><div className={styles.content}>{children}</div></div>;
}
