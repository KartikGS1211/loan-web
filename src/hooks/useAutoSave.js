import { useEffect } from "react";

export default function useAutoSave(data) {
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("loanData", JSON.stringify(data));
      console.log("Auto Saved");
    }, 30000); // every 30 sec

    return () => clearInterval(interval);
  }, [data]);
}
