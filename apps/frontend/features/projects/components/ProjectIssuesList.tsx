//import { Link } from '@/features/i18n/routing'
//import { ProjectIssuesList } from '@/features/projects/projects.queries'
//should import "Issues" Data from additionalInfo:Json
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/design-system/components/ui/card'
import {getTranslations} from "next-intl/server";


export async function ProjectIssuesList({
                                              listOfIssues,
                                          }: {
                                              listOfIssues: { title: string; description: string; id: number }[];
                                          }
                                          //const data = await getProjectIssues()
) {

    const t = await getTranslations('project')
    if(!Array.isArray(listOfIssues) || listOfIssues.length === 0)
        return <p className="text-muted-foreground italic">No Issues</p>

    return (

            <div className="flex-col justify-start items-start gap-4 inline-flex">

                <div
                    className="self-stretch text-2xl font-medium leading-loose">{t('issuesTitle')}
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-4 flex">

                    {listOfIssues.map((issue)=> (
                        <Card key={issue.id} className="min-w-full">
                            <CardHeader>
                                <CardTitle>{issue.title}</CardTitle>
                                <CardDescription>{issue.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))
                    }
                </div>

            </div>



    )
}
