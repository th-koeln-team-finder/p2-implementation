import { CreateProjectForm } from '@/features/projects/components/CreateProjectForm'
import { serverEnv } from '@repo/env'

export default function CreateAProject() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-4">
      <CreateProjectForm maxFileSize={serverEnv.NEXT_PUBLIC_MAX_FILE_SIZE} />
    </div>
  )
}
