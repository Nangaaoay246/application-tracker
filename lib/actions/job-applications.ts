"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplications } from "../models";
import column from "../models/column";
import jobApplications from "../models/jobApplications";

interface jobApplicationData{
    company: string,
    position: string,
    location?: string,
    notes?: string,
    salary?: string,
    jobUrl?: string,
    columnId: string,
    boardId: string,
    tags?: string[],
    description?: string,
}

export async function createJobApplications(data: jobApplicationData){
    const session = await getSession();

    if(!session?.user){
        return {error: "Unauthorized"}
    }

    await connectDB();

    const { 
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags,
        description} = data;
    
    if(!company || !position || !columnId || !boardId){
        return {error: "Missing Required Fields"}
    }

    const board = await Board.findOne({
        _id: boardId,
        userId: session.user.id 
    });

    if(!board){
        return {error: "Board Not Found"}
    }

    const column = await Column.findOne({
        _id: columnId,
        boardId: boardId
    });

    if(!column){
        return {error: "Column Not Found"}
    }

    const maxOrder = (await JobApplications.findOne({ columnId })
    .sort({order: -1})
    .select("order").lean()) as {order: number} | null; 

    const jobApplication = await JobApplications.create({
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        userId: session.user.id,
        tags: tags || [],
        description,
        status: "applied",
        order: maxOrder ? maxOrder.order + 1 : 0,
    })

    await Column.findByIdAndUpdate(columnId, {
        $push: {jobApplications: jobApplication._id}
    });

    revalidatePath("/dashboard");

    return {data: JSON.parse(JSON.stringify(jobApplication))};

}

export async function updateJobApplication(
    id: string,
    updates: {
        company?: string,
        position?: string,
        location?: string,
        notes?: string,
        salary?: string,
        jobUrl?: string,
        columnId?: string,
        order?: number,
        tags?: string[],
        description?: string,
    }) {
    const session = await getSession();

    if(!session){
        return {error: "Unauthorized"};
    }

    const jobApplication = await JobApplications.findById(id);

    if (!jobApplication) {
        return { error: "Job application not found" };
    }

    if (jobApplication.userId !== session.user.id) {
        return { error: "Unauthorized" };
    }

    const {columnId, order, ...otherUpdates} = updates;

    const updatesToApply: Partial<{
        company: string;
        position: string;
        location: string;
        notes: string;
        salary: string;
        jobUrl: string;
        columnId: string;
        order: number;
        tags: string[];
        description: string;
    }> = otherUpdates;

    const currentColumnId = jobApplication.columnId.toString();
    const newColumnId = columnId?.toString();

    const isMovingToDifferentColumn = newColumnId && newColumnId !== currentColumnId;

    if(isMovingToDifferentColumn){
        await Column.findByIdAndUpdate(currentColumnId, {
            $pull: {jobApplications: id}
        });

        const jobsInTargetColumn = await JobApplications.find({
            columnId: newColumnId,
            _id: {$ne: id}
        })
        .sort({order: 1})
        .lean();
        
        let newOrderValue: number;

        if(order !== undefined && order !== null){
            newOrderValue = order * 100;
            
            const jobsThatNeedToShift = jobsInTargetColumn.slice(order);
            for(const job of jobsThatNeedToShift){
                await JobApplications.findByIdAndUpdate(job._id, {
                    $set: {order: job.order+100},
                })
            }
        } else{
            if(jobsInTargetColumn.length > 0){
                const lastJobOrder = jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
                newOrderValue = lastJobOrder + 100
            } else {
                newOrderValue = 0;
            }
        }

        updatesToApply.columnId = newColumnId;
        updatesToApply.order = newOrderValue;

        await Column.findByIdAndUpdate(newColumnId, {
            $push: {jobApplications: id}
        });
    } else if (order!== undefined && order!== null){
         const otherJobsInColumn = await JobApplications.find({
            columnId: currentColumnId,
            _id: {$ne: id}
        })
        .sort({order: 1})
        .lean();

        const currentJobOrder = jobApplication.order || 0;
        const currentPositionIndex = otherJobsInColumn.findIndex((job) => 
            job.order > currentJobOrder);
        const oldPositionIndex = currentPositionIndex === -1 
            ? otherJobsInColumn.length 
            : currentPositionIndex;

        const newOrderValue = order * 100;

        if(order < oldPositionIndex){
            const jobToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);

            for(const job of jobToShiftDown){
                 await JobApplications.findByIdAndUpdate(job._id, {
                    $set: {order: job.order+100},
                });
            }
        } else if(order > oldPositionIndex){
            const jobsToShiftUp = otherJobsInColumn.slice(oldPositionIndex, order);
            
            for(const job of jobsToShiftUp){
                const newOrder = Math.max(0, job.order - 100);
                 await JobApplications.findByIdAndUpdate(job._id, {
                    $set: {order: newOrder},
                });
            }
        }
        updatesToApply.order = newOrderValue;
    }

    const updated = await JobApplications.findByIdAndUpdate(id, updatesToApply, {
        new: true,
    })

    revalidatePath("/dashboard");
    return {data: JSON.parse(JSON.stringify(updated))};

}