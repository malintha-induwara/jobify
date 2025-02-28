import { RootState } from "@/store";
import { Redirect, Slot } from "expo-router";
import { useSelector } from "react-redux";

export default function AppLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return <Redirect href="/sign-in" />;
  return <Slot />;
}
