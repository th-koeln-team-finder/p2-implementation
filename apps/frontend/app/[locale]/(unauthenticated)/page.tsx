import { Link } from '@/features/i18n/routing'
import { AddTestButton, RemoveTestButton, TestItemList } from '@/features/test'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/design-system/components/ui/alert-dialog'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar'
import { Badge } from '@repo/design-system/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb'
import { Button } from '@repo/design-system/components/ui/button'
import { Calendar } from '@repo/design-system/components/ui/calendar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/design-system/components/ui/carousel'
import { Checkbox } from '@repo/design-system/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/design-system/components/ui/hover-card'
import { Input } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover'
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip'
import {
  ChevronDownIcon,
  SendHorizontalIcon,
  Settings2Icon,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'

// TODO remove - Only for testing
export const dynamic = 'force-dynamic'

const carouselItems = Array.from({ length: 5 })
  .map((_, i) => `item-${i}`)
  .map((v) => (
    <CarouselItem key={v}>
      <div className="p-1">
        <Card>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="font-semibold text-4xl">{v}</span>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  ))
const tagScrollItems = Array.from({ length: 50 })
  .map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
  .map((tag) => (
    <div key={tag} className="text-sm">
      {tag}
    </div>
  ))

export default async function Home() {
  const translate = await getTranslations()
  return (
    <div className="container mx-auto my-4">
      <h1 className="font-semibold text-5xl">
        {translate('test.normalHeading')}
      </h1>
      <h2 className="mb-8 text-3xl">{translate('test.normalFont')}</h2>
      <h1 className="font-head font-semibold text-5xl">
        {translate('test.otherHeading')}
      </h1>
      <h2 className="mb-8 font-head text-3xl">{translate('test.otherFont')}</h2>
      <div className="flex flex-row justify-between gap-2 bg-card align-center">
        <h3 className="mt-4 mb-2 font-head text-3xl">
          {translate('test.dataTitle')}
        </h3>
        <div className="ml-auto flex flex-row gap-2">
          <AddTestButton />
          <RemoveTestButton />
        </div>
      </div>
      <TestItemList />
      <Link href="/projects">{translate('test.toProjectPage')}</Link>
      <h3 className="mt-4 mb-2 font-head text-3xl">Components</h3>
      <div className="flex flex-col gap-2 px-4 pb-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Open alert dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you really sure you want to do this?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. (Well technically it does not do
                anything, but still you cannot take it back)
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {translate('general.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction>{translate('general.save')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-row items-center gap-2">
          <Badge variant="default">Badge (default)</Badge>
          <Badge variant="outline">Badge (outline)</Badge>
          <Badge variant="destructive">Badge (destructive)</Badge>
          <Badge variant="secondary">Badge (secondary)</Badge>
          <Badge variant="warning">Badge (warning)</Badge>
          <Badge variant="success">Badge (success)</Badge>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/apps/frontend/public">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex flex-row items-center gap-1">
                    Projects <ChevronDownIcon size={16} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Projects</DropdownMenuItem>
                  <DropdownMenuItem>Brainstorms</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-row flex-wrap items-center gap-2">
          <Button variant="default" size="default">
            Button (default,default)
          </Button>
          <Button variant="outline" size="icon">
            <Settings2Icon />
          </Button>
          <Button variant="secondary" size="lg">
            Button (secondary,lg)
          </Button>
          <Button variant="destructive" size="sm">
            Button (destructive,sm)
          </Button>
          <Button variant="ghost">Button (ghost,default)</Button>
          <Button variant="link">Button (link,default)</Button>
        </div>

        <Calendar mode="single" />

        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>
              Send <SendHorizontalIcon />
            </Button>
          </CardFooter>
        </Card>

        <Carousel className="ml-12 w-full max-w-xs">
          <CarouselContent>{carouselItems}</CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Your profile</DropdownMenuItem>
              <DropdownMenuItem>My profile</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <HoverCard>
          <p>
            by{' '}
            <HoverCardTrigger>
              <span className="font-semibold underline">myself</span>
            </HoverCardTrigger>
          </p>
          <HoverCardContent>
            This is the content of a hover card
          </HoverCardContent>
        </HoverCard>

        <div>
          <Label>Input</Label>
          <Input placeholder="Type here..." />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button>Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>This is the content of the popover</PopoverContent>
        </Popover>

        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
            {tagScrollItems}
          </div>
        </ScrollArea>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Number</SelectLabel>
              <SelectItem value="1">One</SelectItem>
              <SelectItem value="2">Two</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Letter</SelectLabel>
              <SelectItem value="a">A</SelectItem>
              <SelectItem value="b">B</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip>
            <p>
              hover over{' '}
              <TooltipTrigger>
                <span className="font-semibold underline">this</span>
              </TooltipTrigger>
            </p>
            <TooltipContent>This is the content of a tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
