export function getRandomMutedColor() {
    const hue = Math.floor(Math.random() * 360); // qualquer matiz
    const saturation = Math.floor(Math.random() * 30) + 30; // 30–60%: moderadamente saturado
    const lightness = Math.floor(Math.random() * 30) + 40;  // 40–70%: evita extremos
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }