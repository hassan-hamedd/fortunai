// components/trial-balance/account-attachment-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSignedURL } from "@/app/create/actions";
import {
  Paperclip,
  ExternalLink,
  Trash2,
  Plus,
  FileText,
  Image,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { FileViewer } from "../file-viewer/file-viewer";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.ms-excel",
];

const FILE_TYPE_NAMES = {
  "image/jpeg": "JPEG Image",
  "image/png": "PNG Image",
  "application/pdf": "PDF Document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "Excel Document",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word Document",
  "application/msword": "Word Document",
  "application/vnd.ms-excel": "Excel Document",
};

interface AccountAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
}

interface AccountAttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: string;
  clientId: string;
  attachments: AccountAttachment[];
  onAttachmentAdded: () => void;
  onAttachmentDeleted: (id: string) => void;
}

type DialogView = "list" | "upload" | "preview";

export function AccountAttachmentDialog({
  open,
  onOpenChange,
  accountId,
  clientId,
  attachments,
  onAttachmentAdded,
  onAttachmentDeleted,
}: AccountAttachmentDialogProps) {
  const [currentView, setCurrentView] = useState<DialogView>("list");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewAttachment, setPreviewAttachment] =
    useState<AccountAttachment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setSelectedFile(files[0]);
    setUploadProgress(0);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Get file checksum
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const checksum = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Get signed URL
      const response = await getSignedURL({
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        checksum,
      });

      if (!response.success) {
        throw new Error(response.failure);
      }

      // Upload to S3 with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("PUT", response.success.url);
        xhr.setRequestHeader("Content-Type", selectedFile.type);
        xhr.send(selectedFile);
      });

      // Save attachment metadata
      const attachmentResponse = await fetch(
        `/api/clients/${clientId}/trial-balance/accounts/${accountId}/attachments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: selectedFile.size,
            fileUrl: response.success.url.split("?")[0], // Remove query params
          }),
        }
      );

      if (!attachmentResponse.ok) {
        throw new Error("Failed to save attachment metadata");
      }

      onAttachmentAdded();
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Reset state after successful upload
      setSelectedFile(null);
      setUploadProgress(0);
      setCurrentView("list");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    try {
      const response = await fetch(
        `/api/clients/${clientId}/trial-balance/accounts/${accountId}/attachments/${attachmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete attachment");
      }

      onAttachmentDeleted(attachmentId);
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(attachments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttachments = attachments.slice(startIndex, endIndex);

  const renderListView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Account Attachments
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-4">
          {currentAttachments.map((attachment) => (
            <div
              key={attachment.id}
              className="space-y-2 p-4 rounded-lg border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {attachment.fileType.startsWith("image/") ? (
                    <Image className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {attachment.fileName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (
                    {
                      FILE_TYPE_NAMES[
                        attachment.fileType as keyof typeof FILE_TYPE_NAMES
                      ]
                    }
                    )
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setPreviewAttachment(attachment);
                      setCurrentView("preview");
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setCurrentView("upload")}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload New File
          </Button>
        </div>
      </div>
    </>
  );

  const renderUploadView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => {
              setCurrentView("list");
              setSelectedFile(null);
              setUploadProgress(0);
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          Upload New File
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <p className="font-medium mb-1">Allowed file types:</p>
          <ul className="list-disc list-inside">
            <li>Images (JPEG, PNG)</li>
            <li>PDF Documents</li>
            <li>Microsoft Word Documents (DOC, DOCX)</li>
            <li>Microsoft Excel Spreadsheets (XLS, XLSX)</li>
          </ul>
        </div>
        <div className="w-full border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload
            onChange={handleFileSelect}
            onRemove={handleFileRemove}
            accept={ALLOWED_FILE_TYPES.join(",")}
          />
        </div>

        {selectedFile && (
          <>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-black h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCurrentView("list")}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? `Uploading (${uploadProgress}%)` : "Upload File"}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );

  const renderPreviewView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => {
              setCurrentView("list");
              setPreviewAttachment(null);
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {previewAttachment?.fileName}
        </DialogTitle>
      </DialogHeader>

      {previewAttachment && (
        <FileViewer
          fileUrl={previewAttachment.fileUrl}
          fileType={previewAttachment.fileType}
        />
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        {currentView === "list" && renderListView()}
        {currentView === "upload" && renderUploadView()}
        {currentView === "preview" && renderPreviewView()}
      </DialogContent>
    </Dialog>
  );
}
