import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

const Page = async () => {
  const session = await auth.api.getSession({
    headers : await headers(),
  });

  if(!!session){
    redirect("/");
  }
  return <SignUpView />;
};

export default Page;

// http://http://localhost:3000/sign-up
