import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

type PdfFullscreenProps = {
    fileUrl: string;
};

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [numPages, setNumPages] = useState<number>();

    const { width, ref } = useResizeDetector();

    const { toast } = useToast();

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => {
                if (!v) {
                    setIsOpen(v);
                }
            }}
        >
            <DialogTrigger
                onClick={() => {
                    setIsOpen(true);
                }}
                asChild
            >
                <Button
                    className="gap-1.5"
                    variant="ghost"
                    aria-label="Fullscreen"
                >
                    <Expand className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-width-7xl w-full">
                <SimpleBar
                    autoHide={false}
                    className="max-h-[calc(100vh-10rem)] mt-6"
                >
                    <div ref={ref}>
                        <Document
                            file={fileUrl}
                            className="max-h-full"
                            loading={
                                <div className="flex justify-center">
                                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                                </div>
                            }
                            onLoadError={() => {
                                toast({
                                    title: "Error loading PDF",
                                    description: "Please try again later.",
                                    variant: "destructive",
                                });
                            }}
                            onLoadSuccess={({ numPages }) => {
                                setNumPages(numPages);
                            }}
                        >
                            {new Array(numPages).fill(0).map((_, i) => (
                                <Page
                                    key={i}
                                    width={width ?? 1}
                                    pageNumber={i + 1}
                                />
                            ))}
                        </Document>
                    </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    );
};

export default PdfFullscreen;
