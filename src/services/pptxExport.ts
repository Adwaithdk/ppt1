import pptxgen from "pptxgenjs";
import { Presentation } from "../types";

export async function exportToPptx(presentation: Presentation) {
  const pptx = new pptxgen();
  const themeColor = presentation.themeColor.replace('#', '');
  
  // Set layout
  pptx.layout = "LAYOUT_16x9";

  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: "F1F1F1" };
  
  titleSlide.addText(presentation.title, {
    x: 1,
    y: 2,
    w: "80%",
    fontSize: 44,
    bold: true,
    color: "363636",
    align: "center",
  });
  
  titleSlide.addText(presentation.subtitle, {
    x: 1,
    y: 3.5,
    w: "80%",
    fontSize: 24,
    color: "666666",
    align: "center",
  });

  // Content Slides
  presentation.slides.forEach((slide) => {
    const s = pptx.addSlide();
    const slideBg = slide.backgroundColor?.replace('#', '') || "FFFFFF";
    const slideText = slide.textColor?.replace('#', '') || "363636";
    
    s.background = { color: slideBg };
    
    // Add Title
    s.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      w: "90%",
      fontSize: 32,
      bold: true,
      color: themeColor,
    });

    // Add Content
    const contentText = slide.content.map(point => `• ${point}`).join('\n');
    
    if (slide.layout === 'two-column') {
      const mid = Math.ceil(slide.content.length / 2);
      const col1 = slide.content.slice(0, mid).map(p => `• ${p}`).join('\n');
      const col2 = slide.content.slice(mid).map(p => `• ${p}`).join('\n');
      
      s.addText(col1, {
        x: 0.5,
        y: 1.2,
        w: "45%",
        fontSize: 16,
        color: slideText,
        valign: "top",
      });
      s.addText(col2, {
        x: 5.2,
        y: 1.2,
        w: "45%",
        fontSize: 16,
        color: slideText,
        valign: "top",
      });
    } else if (slide.layout === 'image-right' || slide.layout === 'image-left') {
      const isLeft = slide.layout === 'image-left';
      
      s.addText(contentText, {
        x: isLeft ? 5.2 : 0.5,
        y: 1.2,
        w: "45%",
        fontSize: 16,
        color: slideText,
        valign: "top",
      });

      if (slide.imageUrl) {
        s.addImage({
          path: slide.imageUrl,
          x: isLeft ? 0.5 : 5.2,
          y: 1.2,
          w: 4.3,
          h: 3.5,
        });
      }
    } else if (slide.layout === 'quote') {
      s.addText(`"${slide.content[0]}"`, {
        x: 1,
        y: 1.5,
        w: "80%",
        fontSize: 36,
        italic: true,
        color: themeColor,
        align: "center",
      });
      if (slide.content[1]) {
        s.addText(`— ${slide.content[1]}`, {
          x: 1,
          y: 3.5,
          w: "80%",
          fontSize: 20,
          color: slideText,
          align: "right",
        });
      }
    } else if (slide.layout === 'comparison') {
      const mid = Math.ceil(slide.content.length / 2);
      const col1 = slide.content.slice(0, mid).map(p => `• ${p}`).join('\n');
      const col2 = slide.content.slice(mid).map(p => `• ${p}`).join('\n');
      
      // Left side box
      s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 4.3, h: 3.5, fill: { color: slideBg === "FFFFFF" ? "F8F9FA" : slideBg } });
      s.addText(col1, {
        x: 0.6,
        y: 1.3,
        w: 4.1,
        fontSize: 16,
        color: slideText,
        valign: "top",
      });

      // Right side box
      s.addShape(pptx.ShapeType.rect, { x: 5.2, y: 1.2, w: 4.3, h: 3.5, fill: { color: slideBg === "FFFFFF" ? "E9ECEF" : slideBg } });
      s.addText(col2, {
        x: 5.3,
        y: 1.3,
        w: 4.1,
        fontSize: 16,
        color: slideText,
        valign: "top",
      });
    } else if (slide.layout === 'timeline') {
      const items = slide.content.slice(0, 4);
      items.forEach((item, idx) => {
        const x = 0.5 + (idx * 2.3);
        s.addShape(pptx.ShapeType.ellipse, { x: x + 0.9, y: 1.5, w: 0.5, h: 0.5, fill: { color: themeColor } });
        s.addText(item, {
          x: x,
          y: 2.2,
          w: 2.2,
          fontSize: 14,
          color: slideText,
          align: "center",
        });
      });
      s.addShape(pptx.ShapeType.line, { x: 0.5, y: 1.75, w: 9, h: 0, line: { color: themeColor, width: 2 } });
    } else {
      s.addText(contentText, {
        x: 0.5,
        y: 1.2,
        w: "90%",
        fontSize: 18,
        color: slideText,
        valign: "top",
      });
    }
    // Add Explanation as a smaller text block at the bottom
    s.addText(slide.explanation, {
      x: 0.5,
      y: 4.8,
      w: "90%",
      fontSize: 11,
      color: slideText,
      italic: true,
    });

    if (slide.notes) {
      s.addNotes(slide.notes);
    }
  });

  // Save the Presentation
  await pptx.writeFile({ fileName: `${presentation.title.replace(/\s+/g, '_')}.pptx` });
}
