import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTrialBalance } from "@/hooks/use-trial-balance";
import { parseTrialBalanceFromExcel } from "@/lib/tax-category-matcher";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTrialBalanceContext } from "@/contexts/trial-balance-context";

// Component for Excel File Upload
export function TrialBalanceUpload({ clientId }: { clientId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const { toast } = useToast();
  const { trialBalance } = useTrialBalanceContext();
  const { createAccount } = useTrialBalance(clientId);

  const handleFileSelect = (files: File[]) => {
    setSelectedFile(files[0]);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setProgress(0);
    setTotalAccounts(0);
  };

  const handleSubmit = async () => {
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
      // Parse the Excel file
      const accounts = (await parseTrialBalanceFromExcel(selectedFile)).filter(
        (account) =>
          !trialBalance?.accounts?.find(
            (tAccount) => tAccount?.name === account.name
          )
      );
      setTotalAccounts(accounts.length);

      toast({
        title: "File Analysis",
        description: `Found ${accounts.length} accounts in the trial balance`,
      });

      // Upload each account
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        try {
          await createAccount(account);
          setProgress(Math.round(((i + 1) / accounts.length) * 100));
        } catch (error) {
          toast({
            title: "Error",
            description: `Failed to create account ${account.name}: ${error.message}`,
            variant: "destructive",
          });
          continue;
        }
      }

      toast({
        title: "Success",
        description: `Uploaded ${accounts.length} accounts from trial balance`,
        variant: "default",
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      setSelectedFile(null);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Select Excel File"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload Trial Balance</DialogTitle>
          </DialogHeader>
          <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload
              onChange={handleFileSelect}
              onRemove={handleFileRemove}
              accept=".xlsx,.xls,.csv"
            />
          </div>

          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {selectedFile && (
            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit} disabled={isUploading}>
                {isUploading
                  ? `Uploading (${progress}%)`
                  : "Upload Trial Balance"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
