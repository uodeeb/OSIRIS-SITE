import fs from 'fs';
import path from 'path';

const files = [
  'e:/Books-library2025/mofsedon-novel/OSIRIS-SITE/client/src/components/MainPlayer.tsx',
  'e:/Books-library2025/mofsedon-novel/OSIRIS-SITE/client/src/pages/EnhancedHome.tsx'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

// Fix closing tags with spaces like < /div> or < / motion.div>
content = content.replace(/<\s*\/\s*([a-zA-Z0-9\._]+)\s*>/g, '</$1>');

// Fix opening tags with spaces like < div or < motion.div
const tags = 'div|span|button|svg|motion\\.div|AnimatePresence|path|circle|g|rect|polygon|polyline|line|text|tspan|motion\\.span|motion\\.button|Input|Label|Slider|Switch|ScrollArea|Dialog|DialogContent|DialogHeader|DialogTitle|DialogDescription|Popover|PopoverTrigger|PopoverContent|Accordion|AccordionItem|AccordionTrigger|AccordionContent|Tooltip|TooltipTrigger|TooltipContent|DropdownMenu|DropdownMenuTrigger|DropdownMenuContent|DropdownMenuItem|DropdownMenuSeparator|DropdownMenuLabel|DropdownMenuSub|DropdownMenuSubTrigger|DropdownMenuSubContent|DropdownMenuRadioGroup|DropdownMenuRadioItem|DropdownMenuCheckboxItem|DropdownMenuPortal|DropdownMenuGroup|DropdownMenuShortcut|Select|SelectTrigger|SelectValue|SelectContent|SelectGroup|SelectItem|SelectLabel|SelectSeparator|SelectScrollUpButton|SelectScrollDownButton|Card|CardHeader|CardTitle|CardDescription|CardContent|CardFooter|Tabs|TabsList|TabsTrigger|TabsContent|Separator|Badge|Checkbox|RadioGroup|RadioGroupItem|Collapsible|CollapsibleTrigger|CollapsibleContent|Alert|AlertTitle|AlertDescription|AlertDialog|AlertDialogTrigger|AlertDialogContent|AlertDialogHeader|AlertDialogFooter|AlertDialogTitle|AlertDialogDescription|AlertDialogAction|AlertDialogCancel|AspectRatio|Avatar|AvatarImage|AvatarFallback|ContextMenu|ContextMenuTrigger|ContextMenuContent|ContextMenuItem|ContextMenuCheckboxItem|ContextMenuRadioItem|ContextMenuLabel|ContextMenuSeparator|ContextMenuShortcut|ContextMenuSub|ContextMenuSubTrigger|ContextMenuSubContent|ContextMenuRadioGroup|ContextMenuPortal|ContextMenuGroup|Menubar|MenubarMenu|MenubarTrigger|MenubarContent|MenubarItem|MenubarSeparator|MenubarLabel|MenubarCheckboxItem|MenubarRadioItem|MenubarRadioGroup|MenubarSub|MenubarSubTrigger|MenubarSubContent|MenubarPortal|MenubarGroup|MenubarShortcut|NavigationMenu|NavigationMenuList|NavigationMenuItem|NavigationMenuTrigger|NavigationMenuLink|NavigationMenuContent|NavigationMenuViewport|NavigationMenuIndicator|Progress|Skeleton|Toaster|Command|CommandDialog|CommandInput|CommandList|CommandEmpty|CommandGroup|CommandItem|CommandSeparator|CommandShortcut|Form|FormItem|FormLabel|FormControl|FormDescription|FormMessage|FormField|Calendar|PopoverAnchor|Table|TableCaption|TableHeader|TableRow|TableHead|TableBody|TableCell|TableFooter|ResizablePanelGroup|ResizablePanel|ResizableHandle|Skeleton|video|source|track|h1|h2|h3|p|img|li|ul|a|input|select|textarea|label|form|main|header|footer|section|article|aside|nav|details|summary|canvas|br|hr|i|strong|em|b|u|s|small|sup|sub|code|pre|blockquote|cite|q|dfn|abbr|time|data|var|samp|kbd|mark|ruby|rt|rp|wbr|picture|audio|video|param|object|embed|iframe|map|area|track|nav|footer|header|main|section|article|aside|figure|figcaption|hgroup|search|template|portal|slot|script|style|title|base|link|meta|head|body|html'.split('|');

tags.forEach(tag => {
  const rel = new RegExp('<\\s+' + tag + '(\\s+|>)', 'g');
  content = content.replace(rel, '<' + tag + '$1');
});

// Fix spaces after < in any tag that starts with a letter
content = content.replace(/<\s+([a-zA-Z][a-zA-Z0-9\._]*)/g, '<$1');

// Fix spaces before > in tags
content = content.replace(/([^=])\s+>/g, '$1>');

// Fix attribute spaces like className = " or onClick = {
content = content.replace(/(\w+)\s*=\s*(["'{])/g, '$1=$2');

// Fix specific broken patterns seen in logs
content = content.replace(/<\s*\/\s*>/g, '</>');
content = content.replace(/<\s*>/g, '<>');
content = content.replace(/\s+>\s*{/g, '>{');
content = content.replace(/}\s+<\/([^>]+)>/g, '}</$1>');

// Fix "import { ... } from " with spaces
content = content.replace(/import\s+{\s+([^}]+)\s+}\s+from/g, 'import { $1 } from');

  fs.writeFileSync(filePath, content);
  console.log(`${path.basename(filePath)} repaired successfully.`);
});
