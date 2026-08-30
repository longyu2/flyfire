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
    constructor(x, y, width, height, mode = "rect", z = 1, app = undefined) {
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
        this.z = z
        this.backgroundColor = "black"
        this.app = app
        if (app != undefined) {
            app.regist(this)
        }
    }



    // 碰撞盒默认不带旋转，带旋转的碰撞需单独计算
    // 中心点碰撞检测（直接传入sprite原始数据，无需换算左上角）
    checkCollision(a, b) {
        // a、b结构 {x:中心X, y:中心Y, width, height}
        const halfW1 = a.width / 2;
        const halfH1 = a.height / 2;
        const halfW2 = b.width / 2;
        const halfH2 = b.height / 2;

        // 中心点横向距离
        const dx = Math.abs(a.x - b.x);
        // 中心点纵向距离
        const dy = Math.abs(a.y - b.y);

        // 同时满足：水平重叠 && 垂直重叠 = 碰撞
        return dx < halfW1 + halfW2 && dy < halfH1 + halfH2;
    }


    draw() {
        const color = ctx.fillStyle
        ctx.fillStyle = this.backgroundColor
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
            drawRectRotate(this.lastX, this.lastY, this.width + 4, this.height + 4, this.lastAngle) // 擦除上次的绘制
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
        ctx.fillStyle = color
    }
}



class Flyfire {
    sprites
    isLoop
    constructor(width = 2000, height = 1000) {
        this.sprites = []
        canvas.width = width
        canvas.height = height
        this.isLoop = true
    }
    loop(run) {
        run() // 执行主循环中的代码
        // 渲染所有精灵

        // 保留图层顺序，按从小到大的覆盖顺序去绘制，暂时只制定5个图层
        for (let z = 1; z < 6; z++) {
            for (let i = 0; i < this.sprites.length; i++) {
                if (this.sprites[i].z === z) {
                    this.sprites[i].draw()

                }
            }
        }

        if (this.isLoop) {
            window.requestAnimationFrame(() => this.loop(run))
        }
    }
    regist(sprite) {
        if (this.sprites.includes(sprite)) {
            console.warn('Sprite 已注册，跳过');
            return this;
        }
        this.sprites.push(sprite);

    }
    registArr(sprites) {
        for (const sprite of sprites) {
            this.regist(sprite);
        }
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
    drawArc(x, y, radius, color = "black", fill = true) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        let lastColor = ctx.fillStyle
        ctx.fillStyle = color
        if (fill) {
            ctx.fill();
        }
        else {
            ctx.stroke()
        }
        ctx.closePath()
        ctx.fillStyle = lastColor
    }
    rotate(x, y, angle) {
        // 将极小的数变成0，用来清除接近直角旋转时的浮点数带来的误差
        function clampTiny(v) {
            return Math.abs(v) < 1e-10 ? 0 : v;
        }
        const c = clampTiny(Math.cos(angle));
        const s = clampTiny(Math.sin(angle));

        return {
            x: Math.floor(x * c - y * s),
            y: Math.floor(x * s + y * c)
        }

    }

}

export { Sprite, Flyfire, Tool, ctx, canvas }