'use client'

import { useFileUpload } from '@/features/file-upload/file-upload.hooks'
import { useRouter } from '@/features/i18n/routing'
import {createApplication, createInvitation} from '@/features/projects/projects.actions'
import { useForm } from '@formsignals/form-react'
import { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useComputed, useSignals } from '@preact/signals-react/runtime'
import { UserSelect } from '@repo/database/schema'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {
    WysiwygEditorForm,
    getStringContentFromEditor,
    useLexicalEditorRef,
} from '@repo/design-system/components/WysiwygEditor'
import { FileInlinePreviewsForm } from '@repo/design-system/components/custom/file-inline-previews-form'
import { FileListForm } from '@repo/design-system/components/custom/file-list-form'
import { FileUploadForm } from '@repo/design-system/components/custom/file-upload'
import { Button } from '@repo/design-system/components/ui/button'
import { Label } from '@repo/design-system/components/ui/label'
import { clientEnv } from '@repo/env/client'
import { UserPlusIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {UserAvatar} from "@/features/auth/components/UserAvatar";
import {CardTitle} from "@repo/design-system/components/ui/card";
import {UserWithImage} from "@/features/users/users.types";

type InviteFormValues = {
    message: string
}

type InvitationDetailProps = {
    projectId: string
    user:UserWithImage
}

export default function InvitationDetail({
                                              projectId,user
                                          }: InvitationDetailProps) {
    useSignals()

    const router = useRouter()
    const t = useTranslations('projects.invite')
    const translateError = useTranslations('validation')
    const [alertMessage, setAlertMessage] = useState<string | null>(null)


    const form = useForm<InviteFormValues, typeof ZodAdapter>({
        validatorAdapter: ZodAdapter,
        defaultValues: {
            message: '',
        },
        onSubmit: async (values) => {
            // if (!session?.user?.id)
            await createInvitation(
                {
                    projectId: projectId,
                    userId: user.id,
                    message: values.message,
                },
            )

            setAlertMessage('Deine Anfrage wurde versendet.')
            setTimeout(() => {
                setAlertMessage(null)
            }, 5000)

            setTimeout(() => {
                form.reset()
                router.replace(`/projects/${projectId}`)
            }, 1000)
        },
    })

    const editorRef = useLexicalEditorRef()

    return (
        <form.FormProvider>
            <form
                className="container mx-auto max-w-screen-lg px-4"
                onSubmit={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    await form.handleSubmit()
                }}
            >
                <h1 className="mb-6 font-semibold text-2xl">{t('title')}</h1>

                {alertMessage && (
                    <div
                        className="-translate-x-1/2 fixed top-4 left-1/2 z-101 rounded-lg border-2 border-primary bg-background p-8 text-normal">
                        {alertMessage}
                    </div>
                )}
                <div className="flex w-full mb-6 flex-row justify-between gap-4 ">
                    <UserAvatar user={user} className="h-20 w-20"/>
                    <div className="w-full space-y-2">
                        <div className="flex flex-row items-center justify-between gap-2">
                            <p className={'text-sm'}>{user.occupation ?? ' '}</p>
                        </div>
                        <div className="flex flex-row items-center justify-between gap-2">
                            <CardTitle className="text-l">{user.name}</CardTitle>
                        </div>
                    </div>
                </div>
                <div className="mb-6 flex w-full flex-row  lg:flex-row">
                    <div className="mb-4 gap-4 w-full">
                        <form.FieldProvider
                            name="message"
                            validator={() => {
                                if (!editorRef.current) return null
                                return getStringContentFromEditor(editorRef.current).length <= 0
                                    ? translateError('required')
                                    : null
                            }}
                        >
                            <div>
                                <Label>{t('form.message')}</Label>
                                <WysiwygEditorForm
                                    className="min-h-56"
                                    editorRef={editorRef}
                                    placeholder={t('form.placeholderMessage')}
                                />
                                <FieldError/>
                            </div>
                        </form.FieldProvider>
                    </div>
                </div>
                <div className="mb-6 flex w-full justify-center">
                    <Button
                        type="submit"
                        onClick={async () => {
                            await form.handleSubmit()
                        }}
                    >
                        <UserPlusIcon/>
                        {t('form.submit')}
                    </Button>
                </div>
            </form>
        </form.FormProvider>
    )
}
