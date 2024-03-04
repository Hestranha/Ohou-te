const container_confetti = document.createElement("div");
function fireworks(count, interval) {
    function createFirework() {
        const firework = document.createElement("div");
        firework.innerHTML = `
        <div class="firework firework-left-1"></div>
        <div class="firework firework-left-2"></div>
        <div class="firework firework-right-1"></div>
        <div class="firework firework-right-2"></div>
      `;
        container_confetti.appendChild(firework);
    }
    container_confetti.style.pointerEvents = "none";

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createFirework();
        }, interval * i);
    }

    setTimeout(() => {
        container_confetti.remove();
    }, (count + 4) * interval);

    document.body.appendChild(container_confetti);
}
//fireworks(10, 500);
