// import { createServerSupabase } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

const Page = async () => {
  // const supabase = await createServerSupabase();

  // const { data } = await supabase.auth.getUser();

  // // if (data.user) redirect("/");

  return <LoginForm />;
};

export default Page;
