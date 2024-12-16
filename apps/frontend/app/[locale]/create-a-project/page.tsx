import {StepperComponent, ContentItem} from "@repo/design-system/components/stepper";
import {Input} from "@repo/design-system/components/ui/input";
import {Label} from "@repo/design-system/components/ui/label";

export default function CreateAProject() {

    const steps = [
        { id: "basics", title: "Basis", description: "Provide shipping details"},
        { id: "skills", title: "Fähigkeiten", description: "Review your details"},
        { id: "team", title: "Team-Mitglieder", description: "Review your details"},
        { id: "timetable", title: "Zeitplan", description: "Review your details"},
        { id: "links", title: "Links", description: "Review your details"},
        { id: "review", title: "Überblick", description: "Review your details"},
    ];


  return (
      <div className='mx-auto w-full max-w-screen-xl p-4'>
          <StepperComponent steps={steps}>

              <ContentItem stepId="basics">
                  <div className="flex w-full flex-row gap-4">
                      <div className="w-1/2">
                          <Label>Projektname</Label>
                          <Input placeholder="Type here..."/>
                      </div>
                      <div className="w-1/2">
                          <Label>Projektphase</Label>
                          <Input placeholder="Type here..."/>
                      </div>
                  </div>

                  <div className="flex w-full flex-row gap-4">
                      <div className="w-1/2">
                          <Label>Images</Label>
                          <br/>FileUpload für Images
                      </div>
                      <div className="w-1/2">
                          <Label>Description</Label>
                          <br/>Textarea
                      </div>
                  </div>
              </ContentItem>

              <ContentItem stepId="skills">
                  <div>Skill Liste</div>
              </ContentItem>
              <ContentItem stepId="team">
                  <div>Liste an Team Members</div>
              </ContentItem>
              <ContentItem stepId="timetable">
                  <div>Auswahl: Variante Tabelle oder Liste, Eingabe Timetable-Daten</div>
              </ContentItem>
              <ContentItem stepId="links">
                  <div>Issue Link, Location Koordinaten, Links & other</div>
              </ContentItem>
              <ContentItem stepId="review">
                  <div>Übersicht aller Angaben</div>
              </ContentItem>
           </StepperComponent>
      </div>
  )
}