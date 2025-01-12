import type { CreateProjectFormValues } from '@/features/projects/projects.types'
import { useFormContext } from '@formsignals/form-react'
import { useSignals } from '@preact/signals-react/runtime'

export function CreateProjectPreview() {
  useSignals()
  const form = useFormContext<CreateProjectFormValues>()
  const formValues = form.json.value
  return (
    <div>
      <p>{formValues.name}</p>
      <p>{formValues.description}</p>
      <p>{formValues.phase}</p>
      <p>{formValues.status}</p>
      {formValues.skills.map((skill, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: index as key
        <div key={`skill-${index}`}>
          <p>{skill.skill}</p>
          <p>{skill.level}</p>
        </div>
      ))}
      <p>Monday: {formValues.ttMon}</p>
      <p>Tuesday: {formValues.ttTue}</p>
      <p>Wednesday: {formValues.ttWed}</p>
      <p>Tuesday: {formValues.ttThu}</p>
      <p>Friday: {formValues.ttFri}</p>
      <p>Saturday: {formValues.ttSat}</p>
      <p>Sunday: {formValues.ttSun}</p>
      <p>{formValues.timetableCustom}</p>
      {formValues.issues.map((issue, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: index as key
        <div key={`issue-${index}`}>
          <p>{issue.title}</p>
          <p>{issue.description}</p>
        </div>
      ))}
      <p>{formValues.address}</p>
      {formValues.ressources.map((ressource, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: index as key
        <div key={`ressource-${index}`}>
          <p>{ressource.url}</p>
          <p>{ressource.file}</p>
        </div>
      ))}
    </div>
  )
}
