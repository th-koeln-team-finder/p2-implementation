import {getTranslations} from "next-intl/server";
import {Avatar, AvatarFallback, AvatarImage} from "@repo/design-system/components/ui/avatar";
import PreviouslyWorkedOn from "@/features/users/components/PreviouslyWorkedOn";
import {Button} from "@repo/design-system/components/ui/button";
import {UserPlus} from "lucide-react";
import Ratings from "@/features/users/components/Ratings";
import {getUser} from "@/features/users/users.query";

export default async function Profile({
                                        params,
                                      }: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const id: string = (await params).id
  const translate = await getTranslations()
  const user = await getUser(id)

  if (!user) {
    return null
  }

  const lastActivity = new Date()

  return (
    <main className="container mx-auto my-4">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <div className="md:w-1/4">
          <Avatar className="w-40 h-40">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name ?? user.email ?? ''}
              />
            )}
            <AvatarFallback>
              {user.name
                ? user.name.slice(0, 2).toUpperCase()
                : 'AN'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 flex-col space-y-1">
          <p className="font-bold text-xs">
            Developer/Student
          </p>
          <div className="flex items-center gap-4">
            <h1 className="inline font-bold text-3xl">{user.name}</h1>
            <Button>
              <UserPlus/>
              {translate('users.follow')}
            </Button>
            <Ratings/>
          </div>
          <p className="text-muted-foreground text-xs leading-none">
            {translate('users.lastActivity')}: {lastActivity.toLocaleDateString()}
          </p>
          <p className="text-sm">
            {user.bio}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">{translate('users.skills')}</h2>
        <div className="grid grid-rows-3 text-sm">
          <div className="flex items-center max-w-md my-2 gap-2">
            <p className="flex-1">JavaScript</p>
            <div className="flex flex-1 gap-2">
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary-foreground`}/>
            </div>
          </div>
          <div className="flex items-center max-w-md my-2 gap-2">
            <p className="flex-1">React</p>
            <div className="flex flex-1 gap-2">
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary-foreground`}/>
              <div className={`w-1 h-1 rounded-full bg-primary-foreground`}/>
            </div>
          </div>
          <div className="flex items-center max-w-md my-2 gap-2">
            <p className="flex-1">TypeScript</p>
            <div className="flex flex-1 gap-2">
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
              <div className={`w-1 h-1 rounded-full bg-primary`}/>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">{translate('users.previouslyWorkedOn')}</h2>
        <PreviouslyWorkedOn
          loadMoreProjectsText={translate('users.loadMoreProjects')}
        />
      </div>
    </main>
  )
}