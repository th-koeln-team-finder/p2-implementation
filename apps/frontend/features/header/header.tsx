import { Link } from '@/features/i18n/routing'
import { Button } from '@repo/design-system/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import { Input } from '@repo/design-system/components/ui/input'
import {
  BellIcon,
  BrainCircuitIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from 'lucide-react'

export default function Header() {
  return (
    <header className="header flex w-full self-stretch px-4 py-2">
      <div className="icon relative h-16 w-16">
        <a href="/">
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <Logo> */}
          <svg viewBox="0 0 400 400" fill="none">
            <path
              d="M166.61 142.88C162.89 144.97 159.04 146.84 155.1 148.54C142.45 153.98 129.05 158.26 115.28 158.48C110.63 158.55 105.69 158.06 101.95 155.29C97.94 152.33 96.38 145.88 98.75 141.38C101.55 136.06 109.5 135.45 114.71 134.88C136.93 132.46 159.57 120.88 175.72 105.42C177.1 104.1 179.73 101.74 181.55 102.32C183.24 102.86 184.67 104.92 185.5 106.35C187 108.93 190.68 115.47 190.68 115.47C190.68 115.47 192.24 117.7 192.44 119.99C192.67 122.72 187.38 127.67 187.38 127.67C181.31 133.93 174.14 138.65 166.62 142.87L166.61 142.88Z"
              fill="#18181B"
            />
            <path
              d="M130.79 118.5C139.66 118.5 146.85 111.31 146.85 102.44C146.85 93.5703 139.66 86.38 130.79 86.38C121.92 86.38 114.73 93.5703 114.73 102.44C114.73 111.31 121.92 118.5 130.79 118.5Z"
              fill="#18181B"
            />
            <path
              d="M232.5 144.01C228.83 141.83 225.28 139.43 221.85 136.87C210.81 128.64 200.4 119.17 193.33 107.35C190.94 103.36 188.9 98.83 189.42 94.21C189.98 89.25 194.79 84.68 199.86 84.48C205.87 84.24 210.37 90.82 213.47 95.06C226.68 113.1 248.03 126.91 269.49 133.17C271.32 133.7 274.68 134.8 275.08 136.67C275.46 138.41 274.39 140.67 273.56 142.11C272.08 144.7 268.25 151.16 268.25 151.16C268.25 151.16 267.1 153.63 265.21 154.95C262.96 156.52 256.03 154.41 256.03 154.41C247.57 152.28 239.9 148.44 232.49 144.03L232.5 144.01Z"
              fill="#18181B"
            />
            <path
              d="M249.61 108.83C258.48 108.83 265.67 101.64 265.67 92.77C265.67 83.9003 258.48 76.71 249.61 76.71C240.74 76.71 233.55 83.9003 233.55 92.77C233.55 101.64 240.74 108.83 249.61 108.83Z"
              fill="#18181B"
            />
            <path
              d="M264.37 201.68C264.42 197.41 264.73 193.14 265.23 188.88C266.84 175.2 269.84 161.45 276.54 149.42C278.8 145.35 281.7 141.32 285.97 139.46C290.54 137.47 296.91 139.34 299.61 143.64C302.82 148.73 299.37 155.91 297.26 160.71C288.24 181.17 286.96 206.56 292.27 228.28C292.72 230.13 293.45 233.59 292.04 234.87C290.73 236.07 288.23 236.27 286.57 236.28C283.59 236.29 276.08 236.21 276.08 236.21C276.08 236.21 273.36 236.45 271.28 235.47C268.8 234.31 267.16 227.25 267.16 227.25C264.77 218.86 264.27 210.29 264.38 201.68H264.37Z"
              fill="#18181B"
            />
            <path
              d="M317.3 206.94C326.17 206.94 333.36 199.75 333.36 190.88C333.36 182.01 326.17 174.82 317.3 174.82C308.43 174.82 301.24 182.01 301.24 190.88C301.24 199.75 308.43 206.94 317.3 206.94Z"
              fill="#18181B"
            />
            <path
              d="M230.35 258.03C234.07 255.94 237.92 254.07 241.86 252.37C254.51 246.93 267.91 242.65 281.68 242.43C286.33 242.36 291.27 242.85 295.01 245.62C299.02 248.58 300.58 255.03 298.21 259.53C295.41 264.85 287.46 265.46 282.25 266.03C260.03 268.45 237.39 280.03 221.24 295.49C219.86 296.81 217.23 299.17 215.41 298.59C213.72 298.05 212.29 295.99 211.46 294.56C209.96 291.98 206.28 285.44 206.28 285.44C206.28 285.44 204.72 283.21 204.52 280.92C204.29 278.19 209.58 273.24 209.58 273.24C215.65 266.98 222.82 262.26 230.34 258.04L230.35 258.03Z"
              fill="#18181B"
            />
            <path
              d="M266.17 314.53C275.04 314.53 282.23 307.34 282.23 298.47C282.23 289.6 275.04 282.41 266.17 282.41C257.3 282.41 250.11 289.6 250.11 298.47C250.11 307.34 257.3 314.53 266.17 314.53Z"
              fill="#18181B"
            />
            <path
              d="M164.26 256.84C167.93 259.02 171.48 261.42 174.91 263.98C185.95 272.21 196.36 281.68 203.43 293.5C205.82 297.49 207.86 302.02 207.34 306.64C206.78 311.6 201.97 316.17 196.9 316.37C190.89 316.61 186.39 310.03 183.29 305.79C170.08 287.75 148.73 273.94 127.27 267.68C125.44 267.15 122.08 266.05 121.68 264.18C121.3 262.44 122.37 260.18 123.2 258.74C124.68 256.15 128.51 249.69 128.51 249.69C128.51 249.69 129.66 247.22 131.55 245.9C133.8 244.33 140.73 246.44 140.73 246.44C149.19 248.57 156.86 252.41 164.27 256.82L164.26 256.84Z"
              fill="#18181B"
            />
            <path
              d="M147.15 324.14C156.02 324.14 163.21 316.95 163.21 308.08C163.21 299.21 156.02 292.02 147.15 292.02C138.28 292.02 131.09 299.21 131.09 308.08C131.09 316.95 138.28 324.14 147.15 324.14Z"
              fill="#18181B"
            />
            <path
              d="M132.48 199.21C132.43 203.48 132.12 207.75 131.62 212.01C130.01 225.69 127.01 239.44 120.31 251.47C118.05 255.54 115.15 259.57 110.88 261.43C106.31 263.42 99.94 261.55 97.24 257.25C94.03 252.16 97.48 244.98 99.59 240.18C108.61 219.72 109.89 194.33 104.58 172.61C104.13 170.76 103.4 167.3 104.81 166.02C106.12 164.82 108.62 164.62 110.28 164.61C113.26 164.6 120.77 164.68 120.77 164.68C120.77 164.68 123.49 164.44 125.57 165.42C128.05 166.58 129.69 173.64 129.69 173.64C132.08 182.03 132.58 190.6 132.47 199.21H132.48Z"
              fill="#18181B"
            />
            <path
              d="M79.55 226.07C88.4197 226.07 95.61 218.88 95.61 210.01C95.61 201.14 88.4197 193.95 79.55 193.95C70.6803 193.95 63.49 201.14 63.49 210.01C63.49 218.88 70.6803 226.07 79.55 226.07Z"
              fill="#18181B"
            />
          </svg>
        </a>
      </div>

      <div className="flex w-full items-center justify-end gap-12 self-stretch">
        <div className="relative inline-flex min-w-64 items-center">
          <Input
            className="rounded-md border-gray-300"
            type="search"
            placeholder={'Search everywhere...'}
          />
          {/*<SearchIcon className="stroke-gray-300"/>*/}

          {
            //TODO Search Icon
            /*<div className="flex items-center border rounded-md border-gray-300 px-3">
                          <SearchIcon className="h-5 w-5 text-gray-400"/>
                          <Input
                              className="flex-1 border-none focus:ring-0 focus:outline-none ml-2"
                              type="search"
                              placeholder="Search everywhere..."
                          />
                      </div>*/
          }
        </div>

        <nav className="nav flex items-center gap-6">
          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/find-someone">Find Someone</Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/find-a-project">Find a Project</Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/create-a-project">Create a Project</Link>
          </Button>

          <Button
            asChild
            variant="link"
            className="h-fit justify-start p-0 font-medium text-foreground text-sm"
          >
            <Link href="/brainstorm">Brainstorm</Link>
          </Button>

          {/* //TODO Anmelden und Registrieren Buttons & weitere Account etc. verlinken */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus-visible:outline-none">
              {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
              <img
                className="h-8 w-8 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/01/03/17/05/palm-trees-3058728_1280.jpg"
                alt="placeholder"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <User2Icon /> Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <Users2Icon /> My Projects
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <BrainCircuitIcon /> My Brainstorms
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <BellIcon /> Notifications
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:text-primary focus:bg-transparent focus:text-primary">
                <SettingsIcon /> Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
