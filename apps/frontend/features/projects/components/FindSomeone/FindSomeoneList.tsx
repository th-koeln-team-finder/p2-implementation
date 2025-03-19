import {authMiddleware} from "@/auth";
import {type getProjectItems, getUsers} from "@/features/projects/projects.queries";
import {UserFilterSearchParams} from "@/features/projects/components/FindSomeone/FindSomeone.constants";
import { ProjectListEntry} from "@/features/projects/components/FindUserEntry";
import {FindAProjectListEntryProps} from "@/features/projects/components/ProjectListEntry";


type FindSomeoneListProps={
    search?: string
    filters: UserFilterSearchParams
}

const pageSize = 15

export async function FindSomeoneList({
                                }:FindSomeoneListProps
) {
    const session = await authMiddleware()
    const limit = pageSize

    const projectId= session?.user?.id

    if(!projectId){
        console.log("Project not found")
            return null
    }
    const users = await getUsers()

        if(!users.length) return null
    return (
        <>
            <div className="container mx-auto my-4 max-w-screen-xl px-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                    {users.map((user) => (
                        ProjectListEntry({user})
                    ))}
                </div>
            </div>
            </>
            )

            }



