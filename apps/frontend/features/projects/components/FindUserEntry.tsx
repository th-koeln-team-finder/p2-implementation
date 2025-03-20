import {WysiwygRenderer} from '@repo/design-system/components/WysiwygEditor/WysiwygRenderer'
import {Card, CardContent, CardDescription, CardTitle,} from '@repo/design-system/components/ui/card'
import {Button} from "@repo/design-system/components/ui/button";
import {UserRoundPlus} from "lucide-react";
import {UserWithImage} from "@/features/users/users.types";
import {Avatar} from "@repo/design-system/components/ui/avatar";
import {UserAvatar} from "@/features/auth/components/UserAvatar";
import Link from "next/link";


export function FindSomeoneListEntry({user,projectId}: { user: UserWithImage,projectId:string }) {

    return (
        <Link href={`/profile/${user.id}`}>
            <Card className="h-full">
                <CardContent className="flex flex-col items-center relative justify-between p-4 gap-2">
                    <Link href={`/projects/${projectId}/invite/${user.id}`}>
                     <Button variant={"ghost"} className="right-2 top-2 absolute">
                        <UserRoundPlus className="size-5"/>
                    </Button>
                    </Link>
                    <div className={"flex flex-row w-full justify-between gap-4 "}>
                        <UserAvatar user={user} className="w-20 h-20"/>
                        <div className="space-y-2 w-full">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <p className={"text-sm"}>{user.occupation ?? " "}</p>
                            </div>
                            <div className="flex flex-row items-center justify-between gap-2">
                                <CardTitle className="text-l">{user.name}</CardTitle>
                            </div>

                            <CardDescription className="max-h-13 line-clamp-3 overflow-hidden">
                                {user.bio && (
                                    <WysiwygRenderer value={user.bio} renderAsString/>
                                )}
                            </CardDescription>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

/*
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
 */