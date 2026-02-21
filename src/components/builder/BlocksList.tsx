"use client";

import React from "react";
import { useBuilderStore } from "@/store/builder.store";
import { PlusSignIcon } from "hugeicons-react";
import { AddBlockModal } from "@/components/builder/AddBlockModal";
import { BlockCard } from "@/components/builder/BlockCard";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function BlocksList() {
    const { items, reorderItems } = useBuilderStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((b) => b.id === active.id);
            const newIndex = items.findIndex((b) => b.id === over.id);
            reorderItems(oldIndex, newIndex);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            {items.length === 0 ? (
                <div className="flex flex-col flex-1 items-center justify-center p-12 py-20 text-center border ring-1 ring-border/20 rounded-[2rem] bg-card border-dashed">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-5">
                        <PlusSignIcon className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground tracking-tight">No Items</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[240px]">Add your first item to start building your public page.</p>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <BlockCard key={item.id} item={item} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <AddBlockModal />
        </div>
    );
}
