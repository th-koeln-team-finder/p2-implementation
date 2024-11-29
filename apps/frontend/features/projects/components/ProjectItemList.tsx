import { getProjectItems } from '@/features/projects/projects.queries'
import {Link} from "@/features/i18n/routing";

export async function ProjectItemList() {
    const data = await getProjectItems()
    if (!data.length)
        return <p className="text-muted-foreground italic">No data</p>
    return (
        <ul className="list-inside list-decimal">
            {data.map((item) => (
                <li key={item.id}>
                    <Link href={'projects/' + item.id}>{item.name}</Link>
                </li>
            ))}
        </ul>
    )
}
