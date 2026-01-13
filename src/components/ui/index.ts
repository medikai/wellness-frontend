// UI Components Export
// Legacy components (keeping for backward compatibility)
export { default as ProgressBar } from './ProgressBar';
export { default as Icon } from './Icon';
export { default as TextSizeControl } from './TextSizeControl';

// shadcn/ui components (Button and Card are now shadcn components)
export { Button, buttonVariants } from './Button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './Card';
export { Input } from './input';
export { Label } from './label';
export { Textarea } from './textarea';
export { Badge, badgeVariants } from './badge';
export { Alert, AlertTitle, AlertDescription } from './alert';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select';
export { Separator } from './separator';
export { Avatar, AvatarImage, AvatarFallback } from './avatar';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { Skeleton } from './skeleton';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu';