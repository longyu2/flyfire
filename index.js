import { Sprite, Flyfire, canvas, ctx, Tool } from "./flyfire.js";

const app = new Flyfire()
const sprite = new Sprite(500, 500, 50, 50, "rect", 1, app)
let time = 0
app.loop(() => {
    time += 0.01
    sprite.x = 500 + 300 * Math.sin(time)
})