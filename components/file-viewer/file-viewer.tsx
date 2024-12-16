"use client";
import { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { Document, Page, pdfjs } from "react-pdf";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Download,
  File,
} from "lucide-react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
}

interface ExcelSheetData {
  name: string;
  data: any[][];
  headers?: string[];
}

export const FileViewer: React.FC<FileViewerProps> = ({
  fileUrl,
  fileType,
}) => {
  const [fileContents, setFileContents] = useState<string | any[]>("");
  const [excelSheets, setExcelSheets] = useState<ExcelSheetData[]>([]);
  const [wordContent, setWordContent] = useState<{
    html: string;
    text: string;
  }>({ html: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDF-specific state
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<
    { pageIndex: number; matches: number }[]
  >([]);
  const documentRef = useRef<any>(null);

  useEffect(() => {
    const fetchAndProcessFile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(fileUrl);
        const blob = await response.blob();

        if (
          fileType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          fileType === "application/vnd.ms-excel"
        ) {
          await processExcelFile(blob);
        } else if (
          fileType === "application/msword" ||
          fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          await processWordFile(blob);
        } else if (fileType === "application/pdf") {
          await processPDFFile(blob);
        } else if (fileType.startsWith("image/")) {
          processImageFile(blob);
        }
      } catch (err) {
        setError("Failed to load file");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessFile();
  }, [fileUrl, fileType]);

  const processExcelFile = async (blob: Blob) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target?.result, { type: "binary" });
          const sheetsData: ExcelSheetData[] = workbook.SheetNames.map(
            (sheetName) => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
              });

              return {
                name: sheetName,
                data: jsonData as any[][],
                headers: jsonData[0] as string[],
              };
            }
          );

          setExcelSheets(sheetsData);
          resolve();
        } catch (err) {
          setError("Error processing Excel file");
          reject(err);
        }
      };
      reader.readAsBinaryString(blob);
    });
  };

  const processWordFile = async (blob: Blob) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const textResult = await mammoth.extractRawText({ arrayBuffer });

          setWordContent({
            html: result.value,
            text: textResult.value,
          });
          resolve();
        } catch (err) {
          setError("Error processing Word file");
          reject(err);
        }
      };
      reader.readAsArrayBuffer(blob);
    });
  };

  const processPDFFile = async (blob: Blob) => {
    try {
      // Create a URL for the blob to pass to react-pdf
      const pdfUrl = URL.createObjectURL(blob);
      setFileContents(pdfUrl);
    } catch (err) {
      setError("Error processing PDF file");
    }
  };

  const processImageFile = (blob: Blob) => {
    // Create a URL for the blob to use with Next.js Image component
    const imageUrl = URL.createObjectURL(blob);
    setFileContents(imageUrl);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handleSearch = async () => {
    if (!documentRef.current || !searchText) return;

    try {
      const pdf = await pdfjs.getDocument(fileContents as string).promise;
      const searchResults: { pageIndex: number; matches: number }[] = [];

      // Search through each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const matches = textContent.items.filter((item: any) =>
          item.str.toLowerCase().includes(searchText.toLowerCase())
        );

        if (matches.length > 0) {
          searchResults.push({ pageIndex: i - 1, matches: matches.length });
        }
      }

      setSearchResults(searchResults);
      // If search results exist, go to the first page with a match
      if (searchResults.length > 0) {
        setPageNumber(searchResults[0].pageIndex + 1);
      }
    } catch (error) {
      console.error("PDF search error:", error);
    }
  };

  const handleDownload = () => {
    // Create a download link and trigger download
    const link = document.createElement("a");
    link.href = fileContents as string;
    link.download = "document" + getFileExtension(fileType);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (mimeType: string): string => {
    const extensionMap: { [key: string]: string } = {
      "application/pdf": ".pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        ".xlsx",
      "application/vnd.ms-excel": ".xls",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        ".docx",
    };
    return extensionMap[mimeType] || ".file";
  };

  const renderExcelContent = () => {
    if (excelSheets.length === 0) return null;

    return (
      <Tabs defaultValue={excelSheets[0].name} className="w-full">
        {/* Sheet tabs */}
        <TabsList className="grid w-full grid-cols-3">
          {excelSheets.map((sheet) => (
            <TabsTrigger key={sheet.name} value={sheet.name}>
              {sheet.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Sheet content */}
        {excelSheets.map((sheet) => (
          <TabsContent key={sheet.name} value={sheet.name}>
            <ScrollArea className="h-[500px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {sheet.headers?.map((header, index) => (
                      <TableHead key={index} className="font-bold">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheet.data.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderWordContent = () => {
    if (!wordContent.html) return null;

    return (
      <Tabs defaultValue="formatted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formatted">Formatted</TabsTrigger>
          <TabsTrigger value="raw">Raw Text</TabsTrigger>
        </TabsList>

        <TabsContent value="formatted">
          <ScrollArea className="h-[500px] w-full p-4">
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{ __html: wordContent.html }}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="raw">
          <ScrollArea className="h-[500px] w-full p-4">
            <pre className="whitespace-pre-wrap break-words">
              {wordContent.text}
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    );
  };

  const renderPDFContent = () => {
    if (fileType !== "application/pdf") return null;

    return (
      <div className="w-full h-full flex flex-col">
        {/* PDF Controls */}
        <div className="flex justify-between items-center p-2 bg-gray-100">
          <div className="flex space-x-2">
            <Button
              onClick={handleZoomIn}
              variant="outline"
              size="icon"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleZoomOut}
              variant="outline"
              size="icon"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleRotate}
              variant="outline"
              size="icon"
              title="Rotate"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="icon"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Search functionality */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search PDF..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
            <Button
              onClick={handleSearch}
              variant="outline"
              size="icon"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Results Summary */}
        {searchResults.length > 0 && (
          <div className="p-2 bg-blue-50 text-sm">
            Found{" "}
            {searchResults.reduce((sum, result) => sum + result.matches, 0)}{" "}
            matches across {searchResults.length} pages
          </div>
        )}

        {/* PDF Viewer */}
        <div className="w-full flex-grow overflow-auto p-4">
          <Document
            file={fileContents as string}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="flex flex-col items-center"
            loading={<div>Loading PDF...</div>}
            inputRef={documentRef}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
              loading={<div className="text-sm">Loading page...</div>}
            />
          </Document>
        </div>

        {/* Navigation Controls */}
        <div className="mt-4 flex items-center justify-center space-x-4 p-2 bg-gray-100">
          <Button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            variant="outline"
          >
            Previous Page
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            onClick={() =>
              setPageNumber(Math.min(numPages || 1, pageNumber + 1))
            }
            disabled={pageNumber >= (numPages || 1) || numPages === 0}
            variant="outline"
          >
            Next Page
          </Button>
        </div>
      </div>
    );
  };

  const renderImageContent = () => {
    if (!fileType.startsWith("image/")) return null;

    return (
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src={fileContents as string}
          alt="Uploaded file"
          width={500}
          height={500}
          className="object-contain w-auto h-auto max-h-[500px]"
        />
      </div>
    );
  };

  const renderFileContents = () => {
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-full">
          <File className="h-12 w-12 animate-pulse text-gray-500" />
        </div>
      );

    if (error)
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <File className="h-12 w-12 mb-2" />
          <div>{error}</div>
        </div>
      );

    // PDF file handling
    if (fileType === "application/pdf") {
      return renderPDFContent();
    }

    // Excel file handling
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return renderExcelContent();
    }

    // Word file handling
    if (fileType.includes("word")) {
      return renderWordContent();
    }

    // Image file handling
    if (fileType.startsWith("image/")) {
      return renderImageContent();
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <File className="h-12 w-12 mb-2" />
        <div>Unsupported file type</div>
      </div>
    );
  };

  return (
    <div className="w-full h-[600px] overflow-hidden border rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-2 bg-gray-50 border-b">
        <div className="text-sm font-medium">File Viewer</div>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
      <div className="h-[calc(100%-48px)]">{renderFileContents()}</div>
    </div>
  );
};

export default FileViewer;
