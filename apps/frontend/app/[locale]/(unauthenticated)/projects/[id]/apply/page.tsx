import {ProjectSelect, UserSelect} from "@repo/database/schema";
import {getLocale, getTranslations} from "next-intl/server";
import {db} from "@repo/database";
import {authMiddleware} from "@/auth";
import ApplicationDetail from "@/features/Application/ApplicationDetails";
import {Suspense} from "react";
import {BrainstormDetailsLoading} from "@/features/brainstorm/components/loading/BrainstormDetailsLoading";
import {BrainstormDetails} from "@/features/brainstorm/components/brainstorm-details/BrainstormDetails";

export default async function Application(
) {
    const  project  = await db.query.projects.findFirst()
    const  session  = await authMiddleware()

    const [locale, translate, ] = await Promise.all(
        [
            //TODO remove projectSelect and get projectID from projectPage
            getLocale(),
            getTranslations(),
        ],
    )

    console.log("project :"+project?.id)
    console.log("User :"+session?.user.id)
    return (
        <div className="container mx-auto px-4">

                <ApplicationDetail projectData={project!!} userData={session?.user}/>
        </div>)

}