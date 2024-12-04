export function getRandomImages(count: number, images: string[]): string[] {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }