// Animations & explosion effects
export const createExplosion = (rect) => {
  for (let i = 0; i < 15; i++) {
    let particle = document.createElement("div");
    let particleSize = Math.random() * 10 + 5; // Random size between 5px and 15px
    particle.style.width = `${particleSize}px`;
    particle.style.height = `${particleSize}px`;
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color
    particle.className = "explosion-particle";
    particle.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    particle.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
    document.getElementById("explosions").appendChild(particle);

    const animation = particle.animate(
      [
        { transform: "translate(0,0)", opacity: 1 },
        {
          transform: `translate(${Math.random() * 100 - 50}px, 
                     ${Math.random() * 100 - 50}px)`,
          opacity: 0,
        },
      ],
      { duration: 800, easing: "cubic-bezier(0,0.2,0.8,1)" }
    );

    animation.onfinish = () => particle.remove();
  }
};
