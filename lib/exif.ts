import EXIF from "exif-js";

export async function processImage(file: File, maxSize = 600): Promise<Blob> {
  const img = await loadImage(file);
  const orientation = await getOrientation(file);

  const { width, height } = getRotatedSize(img.width, img.height, orientation);

  const scale = Math.min(1, maxSize / Math.max(width, height));
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;

  applyOrientationTransform(ctx, orientation, targetW, targetH);
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9),
  );
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function getOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    EXIF.getData(file as any, function () {
      resolve(EXIF.getTag(this, "Orientation") || 1);
    });
  });
}

function getRotatedSize(w: number, h: number, orientation: number) {
  return orientation >= 5 && orientation <= 8
    ? { width: h, height: w }
    : { width: w, height: h };
}

function applyOrientationTransform(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  w: number,
  h: number,
) {
  switch (orientation) {
    case 3:
      ctx.translate(w, h);
      ctx.rotate(Math.PI);
      break;
    case 6:
      ctx.translate(w, 0);
      ctx.rotate(Math.PI / 2);
      break;
    case 8:
      ctx.translate(0, h);
      ctx.rotate(-Math.PI / 2);
      break;
  }
}
