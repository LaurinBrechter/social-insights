"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";

import { ParsedYouTubeData, PlatformCard } from "@/components/PlatformCard";
import { format, parseISO } from "date-fns";
import { NumVideosWatched } from "@/components/charts/NumVideosWatched";

export default function ImportPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const [parsedData, setParsedData] = useState<ParsedYouTubeData[]>([]);

  const platformIcons = {
    facebook: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 mb-2"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
    youtube: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 mb-2"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    tiktok: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 mb-2"
      >
        <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938" />
      </svg>
    ),
  };

  const aggregateByDay = (data: ParsedYouTubeData[]) => {
    const aggregated: Record<
      string,
      {
        count: number;
      }
    > = {};

    data.forEach((item) => {
      // Convert MEZ timestamp to date string (YYYY-MM-DD)
      const date = item.date.split(",")[0]; // Gets "05.11.2024" from the timestamp

      if (!aggregated[date]) {
        aggregated[date] = {
          count: 0,
        };
      }

      aggregated[date].count += 1;
    });

    return aggregated;
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Select Platform</CardTitle>
          <CardDescription>
            Choose the social media platform you want to analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {(["facebook", "youtube", "tiktok"] as const).map((platform) => (
              <PlatformCard
                key={platform}
                platform={platform}
                selectedPlatform={selectedPlatform}
                icon={platformIcons[platform]}
                setParsedData={setParsedData}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Parsed Data</CardTitle>
          <CardDescription>Videos watched per day</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(aggregateByDay(parsedData)).map(([date, data]) => (
            <div key={date} className="mb-4">
              <h3 className="font-semibold">
                {date} - {data.count} videos
              </h3>
            </div>
          ))}
        </CardContent>
        <NumVideosWatched data={parsedData} />
      </Card>
    </div>
  );
}
