import Page from "@/app/page";
import React from "react";
import DataList from "@/components/DataList"; // Adjust the import path as needed

export default function Home() {
  return (
    <Page>
      <div className="home-content">
        <DataList />
        {/* Additional home page content here */}
      </div>
    </Page>
  );
}
