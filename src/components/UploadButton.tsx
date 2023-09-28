"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={(v: boolean) => {
            if (!v) {
                setIsOpen(v);
            }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>
                    Upload PDF
                </Button>
            </DialogTrigger>

            <DialogContent>
                Content
            </DialogContent>
        </Dialog>
    )
}

export default UploadButton;