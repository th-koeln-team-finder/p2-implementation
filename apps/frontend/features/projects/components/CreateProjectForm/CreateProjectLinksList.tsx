'use client'

import { useFieldContext } from '@formsignals/form-react'
import { FieldError } from '@repo/design-system/components/FormErrors'
import { Button } from '@repo/design-system/components/ui/button'
import { InputForm } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {MinusIcon, PlusIcon} from "lucide-react";
import {SelectContent, SelectForm, SelectItem} from "@repo/design-system/components/ui/select";
import {useState} from "react";
import {useSignals} from "@preact/signals-react/runtime";
// biome-ignore lint/style/useImportType: import type {CreateProjectFormLinks} from "@/features/projects/projects.types";
import {CreateProjectFormLinks} from "@/features/projects/projects.types";
// biome-ignore lint/style/useImportType: zod adapter
import {ZodAdapter} from "@formsignals/validation-adapter-zod";
import {z} from "zod";


export function CreateProjectLinksList() {
    useSignals()
  const field = useFieldContext<CreateProjectFormLinks, 'ressources', typeof ZodAdapter>()
    const [ressourceFormats, setRessourceFormats] = useState<string[]>([]);

    const handleFormatChange = (index: number, value: string) => {
        const updatedFormats = [...ressourceFormats];
        updatedFormats[index] = value;
        setRessourceFormats(updatedFormats);
    };

    return (
      <>
          {field.data.value.map((link, index) => (
              <div key={link.key} className="flex flex-row gap-4">
                  <div className="w-2/6">
                      <field.SubFieldProvider name={`${index}.linkOutput`} validator={z
                          .enum(['link', 'fileUpload'] as const)
                      }>
                          <div>
                              <Label>Auswahl</Label>
                              <SelectForm value={ressourceFormats[index] || ''}
                                          onValueChange={(value) => handleFormatChange(index, value)}
                                          valueProps={{placeholder: "Bitte auswählen"}}>
                                  <SelectContent>
                                      <SelectItem value="link">Link</SelectItem>
                                      <SelectItem value="fileUpload">File Upload</SelectItem>
                                  </SelectContent>
                              </SelectForm>
                              <FieldError/>
                          </div>
                      </field.SubFieldProvider>
                  </div>
                  <div className="w-5/6">
                      {ressourceFormats[index] === 'link' && (

                          <field.SubFieldProvider name={`${index}.url`}
                                                  validator={z.string().min(1)}
                                                  validatorOptions={{
                                                      validateOnChangeIfTouched: true,
                                                  }}>
                              <Label>Link</Label>
                              <InputForm placeholder="Type url..."/>
                              <FieldError/>
                          </field.SubFieldProvider>

                      )}
                      {ressourceFormats[index] === 'fileUpload' && (

                          <field.SubFieldProvider name={`${index}.file`}>
                              <Label>FileUpload</Label>
                              {/*TODO: File Upload*/}

                              {/* <FieldError/> */}
                          </field.SubFieldProvider>
                      )}
                  </div>
                  <div className="flex w-1/6 flex-row justify-between">
                      <div className="flex gap-2">
                          <Button
                              onClick={() => {
                                  field.removeValueFromArray(index);
                                  setRessourceFormats((prev) => prev.filter((_, i) => i !== index));
                              }}
                              variant="outline"
                              className="mt-auto rounded-full p-2 hover:border-fuchsia-700"
                          >
                              <MinusIcon/>
                          </Button>
                          <Button
                              onClick={() => {
                                  field.pushValueToArray({ linkOutput: '', url: '', file: '' });
                                  setRessourceFormats((prev) => [...prev, '']);
                              }}
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
              <Button  onClick={() => {
                  field.pushValueToArray({ linkOutput: '', url: '', file: '' });
                  setRessourceFormats(['']);
              }} className="my-3" style={{width: 'fit-content'}}>
                  Add Link
              </Button>
          )}

      </>
  )
}
