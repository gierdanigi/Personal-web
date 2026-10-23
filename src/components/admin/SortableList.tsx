"use client";

import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Props<T> = {
  items: T[];
  getId: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, handle: ReactNode, index: number) => ReactNode;
  layout?: "list" | "grid";
  className?: string;
};

/** 드래그 앤 드롭 정렬. 손잡이를 끌거나, 모바일에서는 ↑↓ 버튼으로 이동 */
export function SortableList<T>({ items, getId, onReorder, renderItem, layout = "list", className }: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = items.map(getId);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    onReorder(arrayMove(items, from, to));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    move(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableRow key={ids[index]} id={ids[index]}>
              {(dragProps) =>
                renderItem(
                  item,
                  <span className="flex shrink-0 items-center">
                    <button
                      type="button"
                      {...dragProps}
                      aria-label="끌어서 순서 변경"
                      className="hidden cursor-grab touch-none rounded-lg p-1.5 text-muted hover:bg-soft active:cursor-grabbing sm:inline-flex"
                    >
                      <GripVertical className="size-4" />
                    </button>
                    <span className="flex flex-col sm:hidden">
                      <button
                        type="button"
                        aria-label="위로"
                        disabled={index === 0}
                        onClick={() => move(index, index - 1)}
                        className="rounded p-0.5 text-muted disabled:opacity-30"
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="아래로"
                        disabled={index === items.length - 1}
                        onClick={() => move(index, index + 1)}
                        className="rounded p-0.5 text-muted disabled:opacity-30"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                    </span>
                  </span>,
                  index,
                )
              }
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (dragProps: Record<string, unknown>) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(isDragging && "relative z-10 opacity-80")}
    >
      {children({ ...attributes, ...listeners })}
    </div>
  );
}
