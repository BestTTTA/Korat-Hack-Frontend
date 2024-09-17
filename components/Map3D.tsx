"use client";

import React, { useEffect } from "react";

// Extend the global window interface to include Sketchfab
declare global {
  interface Window {
    Sketchfab: any;
  }
}

const Map3D: React.FC = () => {
  useEffect(() => {
    const loadSketchfabScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load the Sketchfab API script."));
        document.body.appendChild(script);
      });
    };

    loadSketchfabScript()
      .then(() => {
        const client = new window.Sketchfab("1.12.1", document.getElementById("api-frame"));
        client.init("12538fea497b435aa7cc449b2ec4b9c6", {
          success: (api: any) => {
            api.start();
            api.addEventListener("viewerready", () => {
              console.log("Viewer is ready");

              // Create a new annotation
              const positionStart = [0, 0, 0]; // Example start position
              const positionEnd = [1, 1, 1];   // Example end position
              const eye = [0, 0, 10];          // Eye position (camera view)
              const target = [0, 0, 0];        // Target position (focus point)

              api.createAnnotation(
                positionStart,
                positionEnd,
                eye,
                target,
                "New Annotation",   // Title of the annotation
                "This is a custom annotation added dynamically.", // Content
                (err: any, index: number) => {
                  if (!err) {
                    console.log(`Annotation created with index: ${index}`);

                    // Update the annotation after creation (optional)
                    api.updateAnnotation(
                      index,
                      {
                        title: "Updated Annotation Title",
                        content: "Updated content for the annotation.",
                        eye: [0, 0, 15],  // Updated eye position
                        target: [0, 0, 0] // Updated target position
                      },
                      (err: any, info: any) => {
                        if (!err) {
                          console.log("Annotation updated:", info);
                        }
                      }
                    );
                  }
                }
              );
            });
          },
          error: () => {
            console.error("Sketchfab API initialization failed");
          },
          annotations_visible: 1,
        });
      })
      .catch((error) => console.error(error));
  }, []);
  
  return (
    // <div className="flex justify-center w-full">
    //   <iframe
    //     id="api-frame"
    //     title="Mega City 2026"
    //     allow="autoplay; xr-spatial-tracking"
    //     src="https://sketchfab.com/models/12538fea497b435aa7cc449b2ec4b9c6/embed?ui_annotations=1"
    //     className="w-[90%] h-[600px] border"
    //   />
    // </div>
    <div className="flex justify-center w-full">
      <iframe
        className="w-[90%] h-[600px] borde"
        title="Mega City 2026"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking
        execution-while-out-of-viewport
        execution-while-not-rendered
        web-share
        src="https://sketchfab.com/models/12538fea497b435aa7cc449b2ec4b9c6/embed?annotations_visible=1&ui_animations=0&ui_infos=0&ui_inspector=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&dnt=1"
      ></iframe>
    </div>
  );
};

export default Map3D;
