import { FileIcon, FileText, ImageIcon, SheetIcon } from 'lucide-react'

type File = {
  key: string
  name: string
  type: string
  downloadLink: string
}

function getIconForFileType(type: string, props?: object) {
  switch (type) {
    case 'image/png':
    case 'image/jpeg':
      return <ImageIcon {...props} />
    case 'application/pdf':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      return <FileText {...props} />
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.ms-excel':
      return <SheetIcon {...props} />
    default:
      return <FileIcon {...props} />
  }
}

export default function FileInlineListCards({ files }: { files: File[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {files.map((file: File) => (
        <a
          href={file.downloadLink}
          target="_blank"
          key={file.key}
          className="flex flex-col gap-2 rounded-lg border border-muted-foreground px-4 py-2"
          rel="noreferrer"
        >
          <div className="flex flex-row items-center gap-2">
            {getIconForFileType(file.type, {
              className: 'text-primary w-8 h-8',
            })}
            <span className="text-sm">{file.name}</span>
          </div>
        </a>
      ))}
    </div>
  )
}
