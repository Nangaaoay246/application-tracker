"use client";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { createJobApplications } from "@/lib/actions/job-applications";

interface CreateJobApplicationDialogProps{
    columnId: string;
    boardId: string;
}


const INITIAL_FORM_DATA = {
    company: "",
    position: "",
    location: "",
    notes: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
};

export default function CreateJobApplicationDialog({columnId, boardId}: 
    CreateJobApplicationDialogProps){

    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        try{
            const result = await createJobApplications({
                ...formData,
                columnId,
                boardId,
                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0)
            });

            if(!result.error){
                setFormData(INITIAL_FORM_DATA);
                setOpen(false);
            } else{
                console.error("Failed to Create Job: ", result.error)
            }

        } catch(err){
            console.error(err);
        }
        }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button
                variant="outline"
                className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Job
                </Button>
            }/>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Job Applications</DialogTitle>
                    <DialogDescription className="text-muted-foreground">Track a New Job Application</DialogDescription>
                </DialogHeader>
                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Company */}
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input
                                id="company"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}/>
                            </div>
                            {/* Position */}
                            <div className="space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input
                                id="position"
                                value={formData.position}
                                onChange={(e) => setFormData({...formData, position: e.target.value})}
                                required/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}/>
                            </div>
                            {/* Salary */}
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                id="salary"
                                value={formData.salary}
                                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                placeholder="e.g., ₱30k - ₱50k"/>
                            </div>
                        </div>
                        {/* Job URL */}
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl">Job Url</Label>
                                <Input
                                id="jobUrl"
                                value={formData.jobUrl}
                                onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
                                placeholder="https://..."/>
                        </div>
                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                                <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                placeholder="Software Engineer, React, Tailwind"/>
                        </div>
                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                                <Textarea
                                rows={3}
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Brief Description of the Role"/>
                        </div>
                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                rows={3}
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}/>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        {/* Cancel Button */}
                        <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        {/* Submit Button */}
                        <Button
                        type="submit">
                            Add Application
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}