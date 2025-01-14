import {getTranslations} from "next-intl/server";
import {authMiddleware} from "@/auth";
import {UserSelect} from "@repo/database/schema";
import {Checkbox} from "@repo/design-system/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/design-system/components/ui/select";
import {Label} from "@repo/design-system/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@repo/design-system/components/ui/card";

export default async function EditProfile() {
  const t = await getTranslations()
  const session = await authMiddleware()
  const user = session!.user! as UserSelect

  return (
    <div>
      <h2 className="font-bold text-2xl mb-8">{
        t('users.settings.notifications.title')}
      </h2>

      <div className="flex items-center space-x-2 mb-4">
        <Checkbox id="terms"/>
        <label
          htmlFor="terms"
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t('users.settings.notifications.activate')}
        </label>
      </div>

      <Card className="overflow-hidden mb-4">
        <CardHeader className="p-0">
          <CardTitle className="py-4 px-6">{t('users.settings.notifications.project')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.joinedProjectUpdated')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.newMemberJoined')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.memberLeft')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.newProjectApplication')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.bookmarkedProjectUpdated')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <CardTitle className="py-4 px-6">{t('users.settings.notifications.profile')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.newFollower')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.newInvite')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="notificationType" className="inline-block mb-2">
              {t('users.settings.notifications.newSkillEvaluation')}
            </Label>
            <Select>
              <SelectTrigger name="notificationType">
                <SelectValue placeholder={t('users.settings.notifications.selectType')}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">E-Mail</SelectItem>
                  <SelectItem value="both">Beide</SelectItem>
                  <SelectItem value="both">Keine</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}