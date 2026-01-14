var canvas, ctx;

function main() {
    canvas = document.getElementById('asg0');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color) {
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;
    const scale = 20;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + v.elements[0] * scale, originY - v.elements[1] * scale);
    ctx.stroke();

    // Arrowhead
    const headlen = 10;
    const dx = v.elements[0] * scale;
    const dy = -v.elements[1] * scale;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(originX + dx, originY + dy);
    ctx.lineTo(
        originX + dx - headlen * Math.cos(angle - Math.PI/6),
        originY + dy - headlen * Math.sin(angle - Math.PI/6)
    );
    ctx.moveTo(originX + dx, originY + dy);
    ctx.lineTo(
        originX + dx - headlen * Math.cos(angle + Math.PI/6),
        originY + dy - headlen * Math.sin(angle + Math.PI/6)
    );
    ctx.stroke();
}

function handleDrawEvent() {
    const x = parseFloat(document.getElementById('xcoord').value) || 0;
    const y = parseFloat(document.getElementById('ycoord').value) || 0;
    const x2 = parseFloat(document.getElementById('xcoord2').value) || 0;
    const y2 = parseFloat(document.getElementById('ycoord2').value) || 0;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const v1 = new Vector3([x, y, 0]);
    const v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    const x = parseFloat(document.getElementById('xcoord').value) || 0;
    const y = parseFloat(document.getElementById('ycoord').value) || 0;
    const x2 = parseFloat(document.getElementById('xcoord2').value) || 0;
    const y2 = parseFloat(document.getElementById('ycoord2').value) || 0;
    const s = parseFloat(document.getElementById('scalar').value) || 1;
    const op = document.getElementById('opt').value;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const v1 = new Vector3([x, y, 0]);
    const v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");

    if (op === "Add") {
        const v3 = new Vector3(v1.elements);
        v3.add(v2);
        drawVector(v3, "green");
    }
    else if (op === "Subtract") {
        const v3 = new Vector3(v1.elements);
        v3.sub(v2);
        drawVector(v3, "green");
    }
    else if (op === "Multiply") {
        const v1s = new Vector3(v1.elements);
        v1s.mul(s);
        const v2s = new Vector3(v2.elements);
        v2s.mul(s);
        drawVector(v1s, "green");
        drawVector(v2s, "green");
    }
    else if (op === "Divide") {
        if (s === 0) {
            console.log("Cannot divide by zero!");
            return;
        }
        const v1s = new Vector3(v1.elements);
        v1s.div(s);
        const v2s = new Vector3(v2.elements);
        v2s.div(s);
        drawVector(v1s, "green");
        drawVector(v2s, "green");
    }
    else if (op === "Angle Between") {
        const angle = angleBetween(v1, v2);
        console.log(`Angle between v1 and v2: ${angle.toFixed(2)}°`);
    }
    else if (op === "Area") {
        const area = areaTriangle(v1, v2);
        console.log(`Area of triangle: ${area.toFixed(3)}`);
    }
    else if (op === "Magnitude") {
        console.log(`Magnitude v1: ${v1.magnitude().toFixed(3)}`);
        console.log(`Magnitude v2: ${v2.magnitude().toFixed(3)}`);
    }
    else if (op === "Normalize") {
        const v1n = new Vector3(v1.elements);
        v1n.normalize();
        const v2n = new Vector3(v2.elements);
        v2n.normalize();
        drawVector(v1n, "green");
        drawVector(v2n, "green");
    }
}

function angleBetween(v1, v2) {
    const dot = Vector3.dot(v1, v2);
    const m1 = v1.magnitude();
    const m2 = v2.magnitude();
    if (m1 === 0 || m2 === 0) return 0;
    let cos = dot / (m1 * m2);
    cos = Math.max(-1, Math.min(1, cos)); // clamp
    return Math.acos(cos) * (180 / Math.PI);
}

function areaTriangle(v1, v2) {
    const cross = Vector3.cross(v1, v2);
    return cross.magnitude() / 2;
}