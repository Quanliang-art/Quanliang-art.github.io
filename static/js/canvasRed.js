$(function(){
  const canvasBox = document.getElementById('canvasBox2');
  const canvas = document.getElementById('myCanvas2');
  const ctx = canvas.getContext('2d');

  const mouse = {
    x: 0,
    y: 0,
    pressed: false,
    radius: 50
  }
  const fixedSpeed = .5; // 固定速度
  // 多边形边界
  const polygon = [
    { x: 320, y: 45 },
    { x: 270, y: 160 },
    { x: 120, y: 125 },
    { x: 210, y: 330 },
    { x: 60, y: 330 },
    { x: 220, y: 460 },
    { x:100, y: 640 },
    { x:230, y: 580 },
    { x:215, y: 820 },
    { x:310, y: 670 },
    { x:535, y: 855 },
    { x:510, y: 650 },
    { x:800, y: 820 },
    { x:640, y: 570 },
    { x:780, y: 430 },
    { x:650, y: 410 },
    { x:760, y: 155 },
    { x:510, y: 200 },
  ];
  // 创建粒子
  const particles = [];
  const zuobiao = [
    {
      x: 345,
      y:320,
    },
    {
      x:320,
      y: 488,
    },
    { 
      x: 520,
      y: 500,
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
      this.pushX = 0;
      this.pushY = 0;
      this.size = Math.random() * 5 + 1;
    }
    update() {
      if (mouse.pressed) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          this.vx -= (dx / distance) * 0.05;
          this.vy -= (dy / distance) * 0.05;
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
      const angle = Math.random() * 2 * Math.PI;
      this.vx = fixedSpeed * Math.cos(angle); // 随机水平速度
      this.vy = fixedSpeed * Math.sin(angle);
    }
    draw() {
      ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
  }
  const imageUrls = [
    'static/images/wg_red.png'
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
  for (let i = 0; i < 3; i++) {
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




