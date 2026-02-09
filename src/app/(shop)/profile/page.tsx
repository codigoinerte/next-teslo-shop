import { auth } from "@/auth";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    // if(!session?.user) redirect("/auth/login?returnTo=/perfil");
    if(!session?.user) redirect("/auth/login");

    return (
        <div>
            <Title 
                title="Perfil"
            />
            <pre>
                {
                    JSON.stringify(session.user, null, 2)
                }
            </pre>
            <div className="my-5 flex flex-row gap-3">
                <h3 className="text-5xl">{session.user.role}</h3>
            </div>
        </div>
    );
}