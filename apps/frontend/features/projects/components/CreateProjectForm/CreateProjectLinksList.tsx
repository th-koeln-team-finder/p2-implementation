'use client'

import { useFieldContext } from '@formsignals/form-react'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {MinusIcon, PlusIcon} from "lucide-react";
import {z} from "zod";
import {SelectContent, SelectForm, SelectItem} from "@repo/design-system/components/ui/select";
import {useState} from "react";
import {useSignals} from "@preact/signals-react/runtime";
// biome-ignore lint/style/useImportType: import type {CreateProjectFormLinks} from "@/features/projects/projects.types";
import {CreateProjectFormLinks} from "@/features/projects/projects.types";
// biome-ignore lint/style/useImportType: zod adapter
import {ZodAdapter} from "@formsignals/validation-adapter-zod";
import {z} from "zod";


export function CreateProjectLinksList() {
  const field = useFieldContext<CreateProjectWithLinksPayload, 'links'>()
  const [ressourceFormat, setRessourceFormat] = useState('')

  return (
      <>
          {field.data.value.map((link, index) => (
              <div key={link.key} className="flex flex-row gap-4">
                  <div className="w-1/4">
                      <field.SubFieldProvider name={`${index}`}> {/*name="linkOutput"
                          validator={z
                              .enum(['choose', 'link', 'fileUpload'] as const)
                              .refine(
                                  (v) => v !== 'choose',
                                  'Oh come on decide now already',
                              )}*/}
                          <div>
                              <Label>Auswahl</Label>
                              <SelectForm value={ressourceFormat}
                                          onValueChange={(value) => setRessourceFormat(value)}>
                                  <SelectContent>
                                      <SelectItem value="choose">Bitte auswählen...</SelectItem>
                                      <SelectItem value="link">Link</SelectItem>
                                      <SelectItem value="fileUpload">File Upload</SelectItem>
                                  </SelectContent>
                              </SelectForm>
                              <FieldError/>
                          </div>
                      </field.SubFieldProvider>
                  </div>
                  <div className="w-1/2">
                      {ressourceFormat === 'link' && (
                          <>
                              {/*
                          <field.SubFieldProvider name={`${index}.url`}> */}
                              <Label>Link</Label>
                              <InputForm placeholder="Type url..."/>
                              {/* <FieldError/>
                          </field.SubFieldProvider> */}
                          </>
                      )}
                      {ressourceFormat === 'fileUpload' && (
                          <>
                              {/* <field.SubFieldProvider name={`${index}.file`}> */}
                              <Label>FileUpload</Label>
                              {/*TODO: File Upload*/}

                              {/* <FieldError/>
                          </field.SubFieldProvider> */}
                          </>
                      )}
                  </div>
                  <div className="flex w-1/2 flex-row justify-between">
                      <div className="flex gap-2">
                          <Button
                              onClick={() => field.removeValueFromArray(index)}
                              variant="outline"
                              className="mt-auto rounded-full p-2 hover:border-fuchsia-700"
                          >
                              <MinusIcon/>
                          </Button>
                          <Button
                              onClick={() => field.pushValueToArray({url: '', file: ''})}
                              variant="outline"
                              className="mt-auto rounded-full border-fuchsia-700 p-2 text-fuchsia-700"
                          >
                              <PlusIcon/>
                          </Button>
                      </div>
                  </div>
              </div>
          ))}
          {field.data.value.length === 0 && (
              <Button onClick={() => field.pushValueToArray({url: '', file: ''})} className="my-3" style={{width: 'fit-content'}}>
                  Add Link
              </Button>
          )}

      </>
  )
}
