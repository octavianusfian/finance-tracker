// import { createServerSupabase } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";

const Page = async () => {
  // const supabase = await createServerSupabase();

  // const { data } = await supabase.auth.getUser();

  // if (data.user) redirect("/tasks");

  return <SignupForm />;
};

export default Page;
