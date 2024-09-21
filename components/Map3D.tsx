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
        script.src =
          "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load the Sketchfab API script."));
        document.body.appendChild(script);
      });
    };

    loadSketchfabScript()
      .then(() => {
        const client = new window.Sketchfab(
          "1.12.1",
          document.getElementById("api-frame")
        );
        client.init("12538fea497b435aa7cc449b2ec4b9c6", {
          success: (api: any) => {
            api.start();
            api.addEventListener("viewerready", () => {
              // console.log("Viewer is ready");

              // Create a new annotation
              const positionStart = [0, 0, 0];
              const positionEnd = [1, 1, 1];
              const eye = [0, 0, 10];
              const target = [0, 0, 0];

              api.createAnnotation(
                positionStart,
                positionEnd,
                eye,
                target,
                "New Annotation",
                "This is a custom annotation added dynamically.",
                (err: any, index: number) => {
                  if (!err) {
                    // console.log(`Annotation created with index: ${index}`);

                    api.updateAnnotation(
                      index,
                      {
                        title: "Updated Annotation Title",
                        content: "Updated content for the annotation.",
                        eye: [0, 0, 15],
                        target: [0, 0, 0],
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
            // console.error("Sketchfab API initialization failed");
          },
          annotations_visible: 1,
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="hidden flex-col items-center md:flex justify-center w-full">
      <div className="text-3xl font-extrabold pt-8 pb-5 text-left">
        <span>3D Map Korat(Mockup)</span>
      </div>
      <iframe
        className="w-[90%] h-[600px]"
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
