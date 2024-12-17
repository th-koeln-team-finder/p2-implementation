"use client";

import {StepperComponent, ContentItem} from "@repo/design-system/components/stepper";
import {Input} from "@repo/design-system/components/ui/input";
import {Label} from "@repo/design-system/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/design-system/components/ui/select"
import {Button} from "@repo/design-system/components/ui/button";
import {MinusIcon, PlusIcon} from "lucide-react";
import {useState} from "react";
import { useForm } from '@formsignals/form-react'
import { configureZodAdapter } from '@formsignals/validation-adapter-zod'
import { FieldError } from '@repo/design-system/components/FormErrors'
import {z} from "zod";

const registerAdapter = configureZodAdapter({
    takeFirstError: true,
})

//TODO Eingaben in Datenbank speichern

export default function CreateAProject() {

    //Stepper
    const steps = [
        { id: "basics", title: "Basis", description: "Provide shipping details"},
        { id: "skills", title: "Fähigkeiten", description: "Review your details"},
        { id: "team", title: "Team-Mitglieder", description: "Review your details"},
        { id: "timetable", title: "Zeitplan", description: "Review your details"},
        { id: "links", title: "Links", description: "Review your details"},
        { id: "review", title: "Überblick", description: "Review your details"},
    ];

    //TODO Form Errors
    //Form Field Provider
    const form = useForm({
        validatorAdapter: registerAdapter,
        defaultValues: {
            name: '',
            email: '',
        },
        /*onSubmit: async (values) => {
            await signIn('passkey', values)
            router.push('/')
        },*/
    })

    //Skills
    const [skills, setSkills] = useState([{ id: 1, name: "", level: "" }]);

    const addSkill = (index: number) => {
        const newSkill = { id: Date.now(), name: "", level: "" };
        const updatedSkills = [...skills];
        updatedSkills.splice(index + 1, 0, newSkill);
        setSkills(updatedSkills);
    };

    const removeSkill = (id: number) => {
        setSkills(skills.filter((skill) => skill.id !== id));
    };


    //Zeitplan
    const [timetableFormat, setTimetableFormat] = useState("");

    return (
      <div className='mx-auto w-full max-w-screen-xl p-4'>
          <StepperComponent steps={steps}>

              <ContentItem stepId="basics">
                  <form.FormProvider>
                      <div className="flex w-full flex-row gap-4">
                          <div className="w-1/2">
                              <form.FieldProvider
                                  name="name"
                                  validator={z
                                      .string()
                                      .min(1)}
                                  validatorOptions={{
                                      validateOnChangeIfTouched: true,
                                  }}
                              >
                                  <Label>Projektname</Label>
                                  <Input id="name" placeholder="Type here..."/>
                                  <FieldError/>
                              </form.FieldProvider>
                          </div>
                          <div className="w-1/2">
                              <Label>Projektphase</Label>
                              <Input id="projectphase" placeholder="Type here..."/>
                          </div>
                      </div>

                      <div className="flex w-full flex-row gap-4">
                          <div className="w-1/2">
                              <Label>Images</Label>
                              <br/>FileUpload für Images
                          </div>
                          <div className="w-1/2">
                              <Label>Description</Label>
                              <br/>Textarea/WYSIWYG?
                          </div>
                      </div>
                  </form.FormProvider>
              </ContentItem>

              <ContentItem stepId="skills">
                  {skills.map((skill, index) => (
                      <div key={skill.id} className="flex w-full flex-row gap-4">
                          <div className="w-1/2">
                              <Label>Skill</Label>
                              <Input id="skill" placeholder="Type here..."/>
                          </div>
                          <div className='flex w-1/2 flex-row justify-between'>
                              <div className="w-5/6">
                                  <Label>Skill-Level</Label><br/>
                                  <Select>
                                      <SelectTrigger className="">
                                          <SelectValue id="skill-level" placeholder="Bitte auswählen..."/>
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="1">1/Learning</SelectItem>
                                          <SelectItem value="2">2</SelectItem>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="4">4</SelectItem>
                                          <SelectItem value="5">5</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                              <div className="flex gap-2">
                                  <Button onClick={() => removeSkill(skill.id)} variant="outline" className="mt-auto rounded-full p-2 hover:border-fuchsia-700">
                                      <MinusIcon/>
                                  </Button>
                                  <Button onClick={() => addSkill(index)} variant="outline" className='mt-auto rounded-full border-fuchsia-700 p-2 text-fuchsia-700'>
                                      <PlusIcon/>
                                  </Button>
                              </div>
                          </div>
                      </div>
                  ))}
              </ContentItem>
              <ContentItem stepId="team">
                  <div>Liste an Team Members - fügt man die überhaupt selbst hinzu?</div>
              </ContentItem>
              <ContentItem stepId="timetable">
                  <div className="flex w-full flex-col gap-4">
                      <div className="w-1/2">
                          <Label>Ausgabe der Timetable</Label>
                          <Select onValueChange={(value) => setTimetableFormat(value)}>
                              <SelectTrigger className="">
                                  <SelectValue id="timetable-output" placeholder="Bitte auswählen..."/>
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="table">Tabelle</SelectItem>
                                  <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>

                      {timetableFormat === "table" && (
                          <div className="flex w-full flex-row gap-4">
                              <div className="w-1/7">
                                  <Label>Montag</Label>
                                  <Input id="tt-mon" placeholder="Type here..."/>
                              </div>
                              <div className="w-1/7">
                                  <Label>Dienstag</Label>
                                  <Input id="tt-tue" placeholder="Type here..."/>
                              </div>
                              <div className="w-1/7">
                                  <Label>Mittwoch</Label>
                                  <Input id="tt-wed" placeholder="Type here..."/>
                              </div>
                              <div className="w-1/7">
                                  <Label>Donnerstag</Label>
                                  <Input id="tt-thu" placeholder="Type here..."/>
                              </div>
                              <div className="w-1/7">
                                  <Label>Freitag</Label>
                                  <Input id="tt-fri" placeholder="Type here..."/>
                              </div>
                              <div className="w-1/7">
                                  <Label>Samstag</Label>
                                  <Input id="tt-sat" placeholder="Type here..."/>
                              </div>
                              <div className="w-1/7">
                                  <Label>Sontag</Label>
                                  <Input id="tt-sun" placeholder="Type here..."/>
                              </div>
                          </div>
                      )}
                      {timetableFormat === "custom" && (
                          <div className="w-1/2">
                              <Label>Timetable - WYSIWYG? Andere Idee?</Label>
                              <Input id="tt-custom" placeholder="Type here..."/>
                          </div>
                      )}
                  </div>
              </ContentItem>
              <ContentItem stepId="links">
                  <div className="flex w-full flex-row gap-4">
                      <div className="w-1/2">
                          <Label>Link für Github Issues</Label>
                          <Input id="issue-link" placeholder="Type here..."/>
                      </div>
                      <div className="w-1/2">
                          <Label>Location</Label>
                          <div className="flex justify-between gap-4">
                              <Input id="location-lat" placeholder="Latitude..."/>
                              <Input id="location-long" placeholder="Longitude..."/>
                          </div>
                      </div>
                  </div>
                  <div className="flex w-full flex-row gap-4">
                      <div className="w-1/2">
                          <Label>Links & other Resources</Label>
                          <Input id="links" placeholder="Type here..."/>
                      </div>
                  </div>
              </ContentItem>
              <ContentItem stepId="review">
                  <div>Übersicht aller Angaben</div>
              </ContentItem>
          </StepperComponent>
      </div>
    )
}