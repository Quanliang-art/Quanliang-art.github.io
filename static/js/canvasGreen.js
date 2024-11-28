$(function(){
  const canvasBox = document.getElementById('canvasBox1');
  const canvas = document.getElementById('myCanvas1');
  const ctx = canvas.getContext('2d');

  const mouse = {
    x: 0,
    y: 0,
    pressed: false,
    radius: 100
  }
  const fixedSpeed = .5; // 固定速度
  // 多边形边界
  const polygon = [
    { x: 470, y: 35 },
    { x: 200, y: 110 },
    { x: 130, y: 165 },
    { x: 110, y: 189 },
    { x: 70, y: 252 },
    { x: 24, y: 548 },
    { x: 140, y: 610 },
    { x: 200, y: 580 },
    { x: 240, y: 447 },
    { x: 280, y: 397 },
    { x: 360, y: 330 },
    { x: 480, y: 330 },
    { x: 550, y: 360 },
    { x: 690, y: 600 },
    { x: 780, y:600 },
    { x: 860, y: 540 },
    { x: 880, y: 400 },
    { x: 780, y: 200 },
    { x: 600, y: 80 },
  ];
  // 创建粒子
  const particles = [];
  const zuobiao = [
    {
      x: 445,
      y: 169,
    },
    {
      x: 273,
      y: 148,
    },
    {
      x: 194,
      y: 235,
    },
    {
      x: 126,
      y: 308,
    },
    {
      x: 576,
      y: 289,
    },
  ];
  // 粒子类
  class Particle {
    constructor(x, y) {
      this.image = images[0];
      this.x = x;
      this.y = y;
      this.radius = 50;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 5 + 1;
    }
    update() {
      if (mouse.pressed) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          this.vx = (dx / distance) * 1;
          this.vy = (dy / distance) * 1;
        }
      }
      this.x += this.vx;
      this.y += this.vy;

      // 检测边界
      if (!isInsidePolygon(this.x, this.y)) {
        this.reflect()
      }
    }
    reflect() {
      // 确保粒子不会卡在边界上
      this.x -= this.vx;
      this.y -= this.vy;
      // 反射速度方向
     /*  this.vx = -(this.vx + (Math.random() - 0.5) * 0.5);
      this.vy = -(this.vy + (Math.random() - 0.5) * 0.5); */
      const angle = Math.random() * 2 * Math.PI;
      this.vx = fixedSpeed * Math.cos(angle); // 随机水平速度
      this.vy = fixedSpeed * Math.sin(angle);
    }
    draw() {
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }
  const imageUrls = [
    'static/images/wg_green.png'
  ];
   // 加载所有图片
  const images = imageUrls.map(url => {
    const img = new Image();
    img.src = url;
    return img;
  });
  canvasBox.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect(); // 获取 canvas 的位置信息
    let x = (e.clientX - rect.left) / docScale;
    let y = (e.clientY - rect.top) / docScale;
    if (isInsidePolygon(x, y)) {
      mouse.pressed = true;
      mouse.x = x;
      mouse.y = y;
    } else {
      if(mouse.pressed ){
        particles.forEach(particle => {
          const angle = Math.random() * 2 * Math.PI;
          particle.vx = fixedSpeed * Math.cos(angle); // 随机水平速度
          particle.vy = fixedSpeed * Math.sin(angle);
        });
      }
      mouse.pressed = false;
    }
  });
  canvasBox.addEventListener('pointerout', e => {
    mouse.pressed = false;
  });
  // 生成粒子
  for (let i = 0; i < 5; i++) {
    const x = zuobiao[i].x;
    const y = zuobiao[i].y;
    particles.push(new Particle(x, y));
  }
  // 确保所有图片都已加载完毕
  Promise.all(images.map(img => new Promise((resolve) => img.onload = resolve))).then(() => {
    animate();
  }); 
  // 射线法边界检测
  function isInsidePolygon(x, y) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制多边形边界
    ctx.strokeStyle = 'transparent';
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    // 更新和绘制粒子
    particles.forEach(particle => {
      particle.draw();
      particle.update();
    });
    requestAnimationFrame(animate);
  }
  
})




