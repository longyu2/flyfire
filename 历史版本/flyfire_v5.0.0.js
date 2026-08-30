document.querySelector("body").appendChild(document.createElement("canvas"))
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 2000
canvas.height = 5000

class Sprite {
    x
    y
    width
    height
    lastX = 0
    lastY = 0
 
    speed
    enabled
    constructor(x, y, width, height, mode = "rect") {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = { x: 0, y: 0 }
        this.enabled = true
        this.backImage = ""
        this.mode = mode
        this.angle = 0
        this.lastAngle = 0
    }
    draw() {

        if (this.mode == "rect") {
            const drawRectRotate = (x, y, width, height, angle) => {
                const tool = new Tool()
                let a = {
                    x: -width / 2,
                    y: -height / 2
                }
                let b = {
                    x: width / 2,
                    y: -height / 2
                }
                let c = {
                    x: width / 2,
                    y: height / 2
                }
                let d = {
                    x: -width / 2,
                    y: height / 2
                }

                let a2 = tool.rotate(a.x, a.y, angle)
                let b2 = tool.rotate(b.x, b.y, angle)
                let c2 = tool.rotate(c.x, c.y, angle)
                let d2 = tool.rotate(d.x, d.y, angle)


                ctx.beginPath()
                ctx.moveTo(a2.x + x, a2.y + y)
                ctx.lineTo(b2.x + x, b2.y + y)
                ctx.lineTo(c2.x + x, c2.y + y)
                ctx.lineTo(d2.x + x, d2.y + y)
                ctx.fill()
                ctx.closePath()
            }

            let color = ctx.fillStyle
            ctx.fillStyle = "white"
            drawRectRotate(this.lastX, this.lastY, this.width+4, this.height+4, this.lastAngle) // 擦除上次的绘制
            ctx.fillStyle = color
            if (this.enabled) {
                // ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)

                drawRectRotate(this.x, this.y, this.width, this.height, this.angle)
            }
        }
        if (this.mode == "arc") {
            const tool = new Tool()
            tool.drawArc(this.lastX, this.lastY, this.width / 2 + 1, "white") // 擦除上次的绘制

            if (this.enabled) {
                tool.drawArc(this.x, this.y, this.width / 2)
            }
        }
        this.lastX = this.x
        this.lastY = this.y
        this.lastAngle = this.angle
    }
}



class Flyfire {
    sprites

    constructor(width = 2000, height = 1000) {
        this.sprites = []
        canvas.width = width
        canvas.height = height
    }
    loop(run) {
        run() // 执行主循环中的代码
        // 渲染所有精灵

        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw()
        }

        window.requestAnimationFrame(() => this.loop(run))
    }
    regist(sprite) {
        this.sprites.push(sprite)
    }
    registArr(sprites) {
        this.sprites = this.sprites.concat(sprites)
    }
}

class Tool {
    drawLine(x1, y1, x2, y2) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    }
    drawArc(x, y, radius, color = "black") {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        let lastColor = ctx.fillStyle
        ctx.fillStyle = color
        ctx.fill();
        ctx.closePath()
        ctx.fillStyle = lastColor
    }
    rotate(x, y, angle) {
        return {
            x: Math.floor(x * Math.cos(angle) - y * Math.sin(angle)),
            y: Math.floor(x * Math.sin(angle) + y * Math.cos(angle))
        }

    }
}

export { Sprite, Flyfire, Tool, ctx }