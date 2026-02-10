import confetti from "canvas-confetti";


function celebrate() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }  
    })
}