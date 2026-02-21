"use client";

import { useBuilderStore } from "@/store/builder.store";
import { PageItemDTO } from "@/types/dto";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DragDropIcon, Copy01Icon, Delete02Icon, Settings02Icon, InformationCircleIcon } from "hugeicons-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export function BlockCard({ item }: { item: PageItemDTO }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const { updateItem, deleteItem, addItem } = useBuilderStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const duplicateItem = () => {
        addItem(item.type, { ...item, id: undefined, order: undefined });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group flex flex-col bg-background border shadow-sm rounded-xl transition-all duration-200",
                isDragging ? "opacity-60 shadow-lg scale-[1.02] border-primary/40 z-50 ring-2 ring-primary/20" : "border-border",
                !item.enabled && "opacity-70 bg-muted/20"
            )}
        >
            <div className="flex items-center justify-between p-4 bg-card rounded-xl">
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <button
                        type="button"
                        className="p-1 -ml-1 text-muted-foreground/60 hover:text-foreground cursor-grab active:cursor-grabbing hover:bg-muted rounded-md transition-colors isolate touch-none outline-none ring-0 focus-visible:ring-0"
                        {...attributes}
                        {...listeners}
                    >
                        <DragDropIcon className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col flex-1 truncate">
                        <span className="text-sm font-semibold capitalize text-foreground truncate">{item.title || item.type}</span>
                        {item.url && <span className="text-xs text-muted-foreground truncate">{item.url}</span>}
                        {item.type === 'email_capture' && <span className="text-xs text-muted-foreground truncate">Email collection block</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2 pl-4">
                    {!item.enabled && <span className="text-[10px] bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-border mr-2 hidden sm:inline-block">Hidden</span>}

                    <Switch checked={item.enabled} onCheckedChange={(val) => updateItem(item.id, { enabled: val })} />

                    <div className="w-px h-5 bg-border mx-1 hidden sm:block" />

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground hidden sm:flex"><Settings02Icon className="h-4 w-4" /></Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                                <SheetTitle className="capitalize">Edit {item.type}</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 py-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input value={item.title || ""} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                                    </div>
                                    {['link', 'embed'].includes(item.type) && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">URL</label>
                                            <Input value={item.url || ""} onChange={(e) => updateItem(item.id, { url: e.target.value })} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border rounded-xl bg-muted/40 flex items-start gap-3 text-sm text-muted-foreground">
                                    <InformationCircleIcon className="h-5 w-5 shrink-0 text-primary" />
                                    <span>Advanced item configuration (thumbnail, schedule, animation) coming soon. Ensure your changes match the specified format.</span>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex" onClick={duplicateItem}>
                        <Copy01Icon className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                <Delete02Icon className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[400px]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete item?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently remove this {item.type} from your page.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteItem(item.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}
