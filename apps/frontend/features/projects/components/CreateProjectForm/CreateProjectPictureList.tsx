'use client'
import {CreateProjectFormLinks, CreateProjectFormPictures} from '@/features/projects/projects.types'
import { useFieldContext } from '@formsignals/form-react'
import type { ZodAdapter } from '@formsignals/validation-adapter-zod'
import { useSignals } from '@preact/signals-react/runtime'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { FileInlinePreviewsForm } from '@repo/design-system/components/custom/file-inline-previews-form'
import { FileUploadForm } from '@repo/design-system/components/custom/file-upload'
import { Button } from '@repo/design-system/components/ui/button'
import { Label } from '@repo/design-system/components/ui/label'
import { clientEnv } from '@repo/env/client'
import { useTranslations } from 'next-intl'
import {InputForm} from "@repo/design-system/components/ui/input";


export function CreateProjectPictureList({
                                           progressState,
                                       }: { progressState?: Record<string, number> }) {
    useSignals()
    const field = useFieldContext<
        CreateProjectFormPictures,
        'pictures',
        typeof ZodAdapter
    >()

    const t = useTranslations('createProjects')
    return (
        <>
            {field.data.value.map((picture, index) => (

                    <field.SubFieldProvider key={picture.key} name={`${index}`}>
                        <div className="flex flex-row items-start gap-4">
                            <CreateProjectPictureListEntry progressState={progressState}/>
                        </div>
                    </field.SubFieldProvider>


            ))}

            {field.data.value.length === 0 && (
                <Button
                    onClick={() => {
                        field.pushValueToArray({
                            label: '',
                            file: [],
                        })
                    }}
                    className="my-3"
                    style={{ width: 'fit-content' }}
                >
                    {t('main.addImages')}
                </Button>
            )}
        </>
    )
}




function CreateProjectPictureListEntry({
                                        progressState,
                                    }: { progressState?: Record<string, number> }) {
    useSignals()
    const field = useFieldContext<
        CreateProjectFormPictures,
        `pictures.${number}`,
        typeof ZodAdapter
    >()

    const t = useTranslations('createProjects')
    const translateError = useTranslations('validation')
    return (

        <div className="w-full lg:w-6/12">

            <field.SubFieldProvider name="file"
            >
                <Label>{t('resources.fileUpload')}</Label>
                <FileUploadForm
                    accepts="image/jpeg,image/jpg,image/png"
                    multiple
                    placeholder={
                        <FileInlinePreviewsForm
                            progressState={progressState}
                            maxFileSize={clientEnv.NEXT_PUBLIC_MAX_FILE_SIZE}
                            placeholder={undefined}
                        />
                    }

                />

                <FieldError/>
            </field.SubFieldProvider>
        </div>

    )
}
