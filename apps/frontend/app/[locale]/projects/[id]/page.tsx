import {getProjectItem} from "@/features/projects/projects.queries";

export default async function Projects({params}: Readonly<{
    params: Promise<{ id: number }>
}>) {
    const id: number = (await params).id
    const project = await getProjectItem(id)

    if (!project) {
        return <div>Project not found</div>
    }

    return (
        <div>
            <h1>Detail</h1>
            <h2>{project.name}</h2>
        </div>
    )
}