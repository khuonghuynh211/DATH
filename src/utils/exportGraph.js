import { toPng } from "html-to-image";

export async function exportGraphAsImage(elementId, fileName = "bdd-graph") {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Graph element not found.");
  }

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
  });

  const link = document.createElement("a");
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  link.click();
}