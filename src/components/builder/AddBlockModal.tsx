"use client";

import { useState } from "react";
import { useBuilderStore } from "@/store/builder.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusSignIcon, LinkSquare02Icon, HeadingIcon, Menu01Icon, Image01Icon, Share01Icon, Mail02Icon } from "hugeicons-react";

export function AddBlockModal() {
    const [open, setOpen] = useState(false);
    const { addItem } = useBuilderStore();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAdd = (type: any, defaultVals: any = {}) => {
        addItem(type, defaultVals);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-12 border-dashed border-2 hover:border-primary/50 text-muted-foreground hover:text-foreground font-semibold rounded-xl mt-4">
                    <PlusSignIcon className="mr-2 h-5 w-5" />
                    Add Item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a Block</DialogTitle>
                    <DialogDescription>
                        Choose a block type to add to your page.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                    <Button variant="outline" className="h-14 justify-start" onClick={() => handleAdd("link", { title: "New Link", url: "https://" })}>
                        <LinkSquare02Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start translate-y-[1px]">
                            <span className="font-semibold text-sm">Link</span>
                            <span className="text-xs text-muted-foreground font-normal">Standard clickable button.</span>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-14 justify-start" onClick={() => handleAdd("header", { title: "Section Header" })}>
                        <HeadingIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start translate-y-[1px]">
                            <span className="font-semibold text-sm">Header</span>
                            <span className="text-xs text-muted-foreground font-normal">Section heading text.</span>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-14 justify-start" onClick={() => handleAdd("divider", { config: { style: "line" } })}>
                        <Menu01Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start translate-y-[1px]">
                            <span className="font-semibold text-sm">Divider</span>
                            <span className="text-xs text-muted-foreground font-normal">Visual separator line or space.</span>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-14 justify-start" onClick={() => handleAdd("social_row", { config: { items: [] } })}>
                        <Share01Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start translate-y-[1px]">
                            <span className="font-semibold text-sm">Social Icons</span>
                            <span className="text-xs text-muted-foreground font-normal">Row of social linking icons.</span>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-14 justify-start" onClick={() => handleAdd("embed", { url: "" })}>
                        <Image01Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start translate-y-[1px]">
                            <span className="font-semibold text-sm">Embed</span>
                            <span className="text-xs text-muted-foreground font-normal">Embed video, music, or widgets.</span>
                        </div>
                    </Button>
                    <Button variant="outline" className="h-14 justify-start" onClick={() => handleAdd("email_capture", { title: "Subscribe", config: { headline: "Join My Newsletter", buttonLabel: "Subscribe" } })}>
                        <Mail02Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start translate-y-[1px]">
                            <span className="font-semibold text-sm">Email Capture</span>
                            <span className="text-xs text-muted-foreground font-normal">Collect audience emails directly.</span>
                        </div>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
