import { Link } from '@/features/i18n/routing'
import {getProjectItems, getUsers} from '@/features/projects/projects.queries'
import { WysiwygRenderer } from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/design-system/components/ui/card'
import Image from 'next/image'
import { FilePreview } from '@/features/file-upload/components/FilePreview'
import { ProjectListEntryToolbar } from '@/features/projects/components/ProjectListEntryToolbar'
import type {UploadedFileSelect, UserSelect} from "@repo/database/schema";
import {CollapsibleContent} from "@repo/design-system/components/ui/collapsible";
import {SkillPointList, SkillPoints} from "@/features/skills/components/SkillScale";


export type PopulatedUser ={
    user: Awaited<ReturnType<typeof getUsers>>[number]}

export function ProjectListEntry({ user }: PopulatedUser) {
    return (

            <Card className="h-full">
                <div className="flex flex-col items-center justify-between p-4 gap-2">
                    <div className={"flex flex-row justify-between gap-2 "}>
                        <Image
                            className="h-full rounded-full object-cover"
                            src="/images/image-placeholder.jpg"
                            height={96}
                            width={96}
                            alt={user.name}
                        />
                        <CardHeader>
                            <div className="flex flex-row items-center justify-between gap-2">
                                <p className={"text-sm "}>{"beschäftigt"}</p>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-2">
                                <CardTitle className="text-l">{user.name}</CardTitle>
                            </div>

                            <CardDescription className="max-h-10 overflow-hidden">
                                {user.bio && (
                                    <WysiwygRenderer value={user.bio} renderAsString/>
                                )}
                            </CardDescription>
                        </CardHeader>
                    </div>
                    <div className={"flex flex-col w-full justify-between gap-2"}>
                        {user.skills.length && (
                        user.skills.map((skill,index) =>
                            index<2 && (
                                <div key={skill.skill.id} className={"flex items-center w-full flex-row justify-between gap-2"}>
                                    <p className={"text-sm "}>{skill.skill.skill}</p>
                                        <SkillPoints currentLevel={skill.level}/>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </Card>
)
}
