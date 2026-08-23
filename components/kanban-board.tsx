"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { Award, Calendar, CheckCircle2, Mic, MoreHorizontal, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/use-boards";
import { closestCorners, DndContext, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { traceGlobals } from "next/dist/trace/shared";
import { CSS } from "@dnd-kit/utilities"; 

interface KanbanBoardProps{
    board: Board;
    userId: string;
}

interface ColConfig{
    color: string, 
    icon: React.ReactNode
}

const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];

function DroppableColumn({column, config, boardId, sortedColumns}: 
    {column: Column; config: ColConfig; boardId: string; sortedColumns: Column[] }){
    
    const {setNodeRef, isOver} = useDroppable({
        id: column._id,
        data: {
            type: "column",
            columnId: column._id,
        }
    });

    const sortedJobs = column.jobApplications.sort((a,b) => a.order - b.order) || [];
    
    return (
        <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0 bg-card">
            {/* Card Header */}
            <CardHeader className={`${config.color} text-primary-foreground rounded-t-lg pb-3 pt-3`}>
                <div className="flex item-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className="text-primary-foreground text-base font-semibold">
                            {column.name}
                        </CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger render = {
                            <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-primary-foreground hover:bg-background/20">
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        }/>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/> Delete Column
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            {/* Card Content */}
            <CardContent 
             ref={setNodeRef} 
             className={`space-y-2 pt-4 bg-card min-h-[400px] rounded-b-lg ${isOver ? "ring-2 ring-primary ": ""}`}>
                <SortableContext 
                 items={sortedJobs.map((job) => job._id)} 
                 strategy={verticalListSortingStrategy}>
                    {sortedJobs.map((job, key)=> (
                        <SortableJobCard 
                         key={key} 
                         job={{...job, columnId: job.columnId || column._id}} 
                         columns={sortedColumns}/>
                 ))}
                </SortableContext>
                 <CreateJobApplicationDialog columnId={column._id} boardId={boardId}/>   
            </CardContent>
        </Card>);
}

function SortableJobCard({job, columns}: {job: JobApplication; columns: Column[] }){
    
    const {attributes, listeners, transform, transition, isDragging, setNodeRef} = useSortable({
        id: job._id,
        data: {
            type:"job",
            job, 
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <JobApplicationCard job={job} columns={columns} dragHandleProps={{...attributes, ...listeners}} />
        </div>
    );
}


export default function KanbanBoard({board, userId}: KanbanBoardProps){
    
    const {columns, moveJob} = useBoard(board);
    
    const sortedColumns = columns?.sort((a,b) => a.order - b.order) || [];
    
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        }
    }));

    async function handleDragStart(){

    }

    async function handleDragEnd() {
        
    }

    return (
        <DndContext 
            id="kanban-board"  
            sensors = {sensors} // Detects Distance Between Boundaries
            collisionDetection={closestCorners} // Detects Boundaries
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <div>
                <div>
                    {columns.map((col, key) => {
                        const config = COLUMN_CONFIG[key] || {
                            color: "bg-gray-500",
                            icon: <Calendar className="h-4 w-4" />,
                        };
                        return <DroppableColumn 
                        key={key} 
                        column={col} 
                        config={config} 
                        boardId={board._id}
                        sortedColumns={sortedColumns}/>
                    })}
                </div>
            </div>
        </DndContext>
    );
}

