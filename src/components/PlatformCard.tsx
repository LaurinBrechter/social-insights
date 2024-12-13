import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

export interface ParsedYouTubeData {
  title: string;
  video_url: string;
  channel: string;
  channel_url: string;
  timestamp: string;
  date: string;
}

interface PlatformCardProps {
  platform: "facebook" | "youtube" | "tiktok";
  selectedPlatform: string | null;
  icon: React.ReactNode;
  setParsedData: (data: ParsedYouTubeData[]) => void;
}

export function PlatformCard({
  platform,
  selectedPlatform,
  icon,
  setParsedData,
}: PlatformCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const parseHTML = (file: File): Promise<Document> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          event.target?.result as string,
          'text/html'
        );
        resolve(doc);
      };
      reader.readAsText(file);
    });
  };

  const parseCell = (cell: Element): ParsedYouTubeData => {
    const links = cell.getElementsByTagName('a');
    const cellText = cell.innerHTML;
    
    return {
      title: links[0].textContent || '',
      video_url: links[0].href,
      channel: links[1].textContent || '',
      channel_url: links[1].href,
      timestamp: cellText.replace('</div>', '').split('<br>')[2],
      date: cellText.split('<br>').slice(-1)[0].split('</div>')[0]
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      if (platform === 'youtube') {
        const doc = await parseHTML(file);
        const cells: ParsedYouTubeData[] = [];
        
        const contentCells = doc.getElementsByClassName('content-cell');
        
        let err_count = 0;
        for (const cell of Array.from(contentCells).slice(0, 1000)) {
          try {
            const cellParsed = parseCell(cell);
            cells.push(cellParsed);
          } catch (error) {
            // console.error('Error parsing cell:', cell.innerHTML);
            err_count++;
          }
        }

        console.log('Error count:', err_count);

        // Convert to CSV and trigger download
        // const headers = Object.keys(cells[0]);
        // const csvContent = [
        //   headers.join(','),
        //   ...cells.map(row => 
        //     headers.map(header => 
        //       JSON.stringify(row[header as keyof ParsedYouTubeData] || '')
        //     ).join(',')
        //   )
        // ].join('\n');

        setParsedData(cells);

        // const blob = new Blob([csvContent], { type: 'text/csv' });
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'youtube_history.csv';
        // a.click();
        // window.URL.revokeObjectURL(url);
        
        setImportSuccess(true);
        toast.success("YouTube history imported successfully!");
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error("Error importing file");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Label
          htmlFor={platform}
          className={`relative flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary ${
            selectedPlatform === platform ? "border-primary" : ""
          }`}
        >
          <div id={platform} className="sr-only" />
          {importSuccess ? (
            <div className="absolute top-2 right-2">
              <CheckIcon className="h-6 w-6 text-green-500" />
            </div>
          ) : null}

          {icon}
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </Label>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Import your {platform.charAt(0).toUpperCase() + platform.slice(1)} data
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input 
            type="file" 
            onChange={handleFileChange}
            accept=".html"
          />
          <Button type="submit" disabled={!file}>
            Import
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
