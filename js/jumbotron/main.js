let canvas, ctx, nodes, SENSITIVITY, SIBLINGS_LIMIT;


// how close next node must be to activate connection (in px)
// shorter distance == better connection (line width)
SENSITIVITY = 100;
// more siblings == bigger node
SIBLINGS_LIMIT = 10;
// amount of nodes to be generated
NODE_COUNT = 100;

nodes = [];

function initCanvas() {
    canvas = document.getElementById('jumbotron');
    ctx = canvas.getContext('2d');
    if (!ctx) {
        alert("Oops! Your browser does not support canvas :'(");
    }
}

class Node{
    constructor(){
        this.x = Math.floor((Math.random() * canvas.width) + 1);
        this.y = canvas.height + Math.floor((Math.random() * (canvas.height / 2)) + 1);
        this.radius = 2;
        this.brightness = 1;
        this.speed = 0.8;
        this.siblings = [];

        this.nodeColor = "rgba(145, 145, 145, " + this.brightness + ")";
        this.connColor = "rgba(145, 145, 145, " + this.brightness + ")";
    }

    move() {
        if (this.y <= -100) {
            this.y = canvas.height + Math.floor((Math.random() * (canvas.height / 2)) + 1);
        }  else {
            this.y -= this.speed;
        }
    }

    drawNode() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2 * this.siblings.length / SIBLINGS_LIMIT, 0, 2 * Math.PI);
        ctx.fillStyle = this.nodeColor;
        ctx.fill();
    }

    drawConn() {
        for (let i = 0; i < this.siblings.length; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.siblings[i].x, this.siblings[i].y);
            ctx.lineWidth = 1 - calcDistance(this, this.siblings[i]) / SENSITIVITY;
            ctx.strokeStyle = this.connColor;
            ctx.stroke();
        }
    }

    findSiblings() {
        this.siblings = [];
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (node !== this) {
                let distance = calcDistance(this, node);
                if (distance < SENSITIVITY) {
                    if (this.siblings.length < SIBLINGS_LIMIT) {
                        this.siblings.push(nodes[i]);
                    } else {
                        let maxDistance = 0;
                        let s = 0;
                        for (let j = 0; j < this.siblings.length; j++) {
                            if (this.siblings[j] > distance) {
                                maxDistance = calcDistance(this.siblings[j], this);
                                s = k;
                            }
                            if (maxDistance > distance) {
                                this.siblings.splice(s, 1, node);
                            }
                        }
                    }
                }
            }
        }
    }
}

function calcDistance(node1, node2) {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + (Math.pow(node1.y - node2.y, 2)));
}

function initNodes(amount) {
    for (i = 0; i < amount; i++) {
        nodes[i] = new Node();
    }
}

function redrawscene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.move();
    }
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.findSiblings();
        node.drawConn();
        if (node.y > 0 && node.y < canvas.height && node.x > 0 && node.x < canvas.width) {
            node.drawNode();
        }
    }
    window.requestAnimationFrame(redrawscene)
}

initCanvas();
initNodes(NODE_COUNT);
redrawscene();
