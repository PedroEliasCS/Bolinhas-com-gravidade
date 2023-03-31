// var bg = document.getElementById("bg");
// var bgctx = bg.getContext("2d");

/**
 *  Sistema de particulas do codigo;
 *  Particle system of the code;
 * @param {HTMLCanvasElement} canvas - Canvas do sistema de particulas;
 * @param {Object} params - Parametros do sistema de particulas vindo da main;
 * @param {HTMLCANVASElement} canvas - Particle system canvas;
 * @param {Object} params - Particle system parameters coming from main;
 */
function particle_system(canvas, params) {
  /**
   * Variavel canvas;
   * Canvas variable;
   */
  var ctx = canvas.getContext("2d");
  /**
   * Particulas;
   * Particles;
   */
  var particles = [];
  /**
   * Particulas em movimento;
   * Particles in motion;
   */
  var drag = [];
  /**
   *  Conexoes entre as particulas;
   * Connections between the particles;
   */
  var connections = [];
  /**
   * Imagem de uma particula circular;
   * Image of a circular particle;
   */
  var circle = (function () {
    var tmpCanvas = document.createElement("canvas");
    var tmpCtx = tmpCanvas.getContext("2d");
    // tamanho da imagem em x
    // Image size in x
    tmpCanvas.width = 8 * 2;
    // tamanho da imagem em Y
    // Image size in Y
    tmpCanvas.height = 8 * 2;
    // cor da imagem
    // image color
    tmpCtx.fillStyle = "gray";
    // Move o ponto de origem para o centro da imagem
    // Move the origin point to the center of the image
    tmpCtx.moveTo(tmpCanvas.width / 2, tmpCanvas.height / 2);
    // Define o ponto de origem
    // Define the origin point
    tmpCtx.beginPath();
    // Desenha um circulo
    // Draw a circle
    tmpCtx.arc(
      tmpCanvas.width / 2,
      tmpCanvas.height / 2,
      tmpCanvas.width / 2,
      Math.PI * 2,
      false
    );
    tmpCtx.closePath();
    tmpCtx.fill();
    return tmpCanvas;
  })();

  /**
   * Informações de uma particula;
   * Information about a particle;
   */
  function Particle() {
    return {
      x:
        (Math.random() * (canvas.width - 2 * params.initialinset) +
          params.initialinset) /
        2,
      y:
        (Math.random() * (canvas.height - 2 * params.initialinset) +
          params.initialinset) /
        2,

      c: 1,

      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,

      color: "rgba(0,0,0,1)",

      radius: 4,
    };
  }

  /**
   * Atualizando conexão entre particulas;
   * Updating connection between particles;
   */
  function updateconnections() {
    // intervalo
    // interval
    var intervals = [];
    // Parametro de força
    // Force parameter
    var dist = params.push + params.pull;

    // Adiciona as particulas no intervalo
    // Adds the particles in the interval

    particles.forEach(function (p, i) {
      intervals.push({
        particle: i,
        type: "start",
        // x: p.x - dist,
      });

      // Push para limpeza da memoria
      // Push for memory cleanup
      // intervals.push({
      // particle: i,
      // type: "end",
      // x: p.x + dist,
      // });
    });

    // Para organização do array em ordem crescente
    // For array organization in ascending order
    intervals.sort(function (p, q) {
      return p.x - q.x;
    });

    var particlesincurrentinterval = new Set();

    for (const curinterval of intervals) {
      if (curinterval.type === "start") {
        // diametro
        var diameter = 2 * dist;
        // raio ao quadrado
        // radius squared
        var radiussquared = dist * dist;
        // particula atual
        // current particle
        var p = particles[curinterval.particle];

        // Faz a comparação da particula atual com as outras particulas
        // Makes the comparison of the current particle with the other particles
        particlesincurrentinterval.forEach(function (index) {
          // particula a ser comparada
          // particle to be compared
          var q = particles[index];

          // distancia entre as particulas em Y
          // distance between particles in Y
          var dy = p.y - q.y;

          // radiussquared = 1000;

          // console.log({ radiussquared });
          if (Math.abs(dy) < diameter) {
            var dx = p.x - q.x;
            var d = dx * dx + dy * dy;
            if (d < radiussquared) {
              connections.push({
                p1: curinterval.particle,
                p2: index,
              });
            }
          }
        });
        particlesincurrentinterval.add(curinterval.particle);
      }
      // else {
      //   particlesincurrentinterval.delete(curinterval.particle);
      // }
    }
  }

  function addvels() {
    var dist = params.push + params.pull;
    var m;
    while (typeof (m = connections.pop()) === "object") {
      var p1 = particles[m.p1];
      var p2 = particles[m.p2];

      var dx = p1.x - p2.x;
      var dy = p1.y - p2.y;

      var d = Math.sqrt(dx * dx + dy * dy);

      var dvx = p1.vx - p2.vx;
      var dvy = p1.vy - p2.vy;

      var dot = (dx * dvx + dy * dvy) / d;
      var f = (params.mult * (dist - d) * (params.push - d)) / d;

      var fx = dx * f;
      var fy = dy * f;

      // var dvx = p1.vx-p2.vx;
      // var dvy = p1.vy-p2.vy;

      // var dot = (dx*dvx+dy*dvy)/d;

      // var dv = Math.sqrt(dvx*dvx+dvy*dvy)

      // var f = d < params.push ? (params.push - d)*params.pushratio : (d-dist) * (1-params.pushratio)
      // // console.log(f)

      // fxs[m.p1]+= dx/d * f;
      // fys[m.p1]+= dy/d * f;

      // fxs[m.p2]-= dx/d * f;
      // fys[m.p2]-= dy/d * f;

      // var visc = d < params.push ? params.visc : 0

      // fxs[m.p1]-= (dvx - dot*dx/d)*visc;
      // fys[m.p1]-= (dvy - dot*dy/d)*visc;

      // fxs[m.p2]+= (dvx - dot*dx/d)*visc;
      // fys[m.p2]+= (dvy - dot*dy/d)*visc;

      // var visc = m.d < params.push  ? params.visc : 0

      p1.ax += (fx * p2.c + (params.visc * (dvx - dot * dx)) / d) / p1.c;
      p1.ay += (fy * p2.c + (params.visc * (dvy - dot * dy)) / d) / p1.c;

      p2.ax -= (fx * p1.c + (params.visc * (dvx - dot * dx)) / d) / p2.c;
      p2.ay -= (fy * p1.c + (params.visc * (dvy - dot * dy)) / d) / p2.c;
    } //*/
    for (var i = 0; i < drag.length; i++) {
      var m = drag[i];
      var d =
        (mouse.x - m.x) * (mouse.x - m.x) + (mouse.y - m.y) * (mouse.y - m.y);
      m.ax += (0.5 * (mouse.x - m.x)) / (1000 * m.c);
      m.ay += (0.5 * (mouse.y - m.y)) / (1000 * m.c);

      // fxs[particles.indexOf(m)]+=(mouse.x-m.x)/(10000*m.c)*1000;
      // fys[particles.indexOf(m)]+=(mouse.y-m.y)/(10000*m.c)*1000;
    }
    for (var i = 0; i < particles.length; i++) {
      // var p=particles[i], fx=fxs[i]*params.mult, fy = fys[i]*params.mult;

      // // p.c=1;

      // // console.log(fx,fy)

      // var oldvx = p.vx
      // var oldvy = p.vy

      // p.vx+=fx;
      // p.vy+=fy;

      // // p.ax=0;
      // // p.ay=0;

      // p.vx*= params.fric;
      // p.vy*= params.fric;

      // p.vy+= params.ygrav;
      // p.vx+= params.xgrav;

      // p.x += p.vx*dt;
      // p.y += p.vy*dt;

      var p = particles[i];

      p.c = 1;
      p.vx += p.ax;
      p.vy += p.ay;
      // console.log(p)

      p.ax = 0;
      p.ay = 0;
      p.vx *= params.fric;
      p.vy *= params.fric;
      p.vy += params.ygrav;
      p.vx += params.xgrav;
      p.x += p.vx;
      p.y += p.vy;
      // console.log(p)

      var bounds = {
        left: p.radius / 2,
        right: (canvas.width - p.radius) / 2,
        top: (p.y < p.radius) / 2,
        bottom: (canvas.height - p.radius) / 2,
      };

      if (p.x < bounds.left) {
        p.x += 1.1 * (bounds.left - p.x);
        p.vx *= -params.bounce;
        p.vy *= params.wfric;
      } else if (p.x > bounds.right) {
        p.x -= 1.1 * (p.x - bounds.right);
        p.vx *= -params.bounce;
        p.vy *= params.wfric;
      }
      if (p.y < bounds.top) {
        p.y += 1.1 * (bounds.top - p.y);
        p.vy *= -params.bounce;
        p.vx *= params.wfric;
      } else if (p.y > bounds.bottom) {
        p.y -= 1.1 * (p.y - bounds.bottom);
        p.vy *= -params.bounce;
        p.vx *= params.wfric;
      } //*/

      var inset = p.radius + 100;
      var insetacceleration = 0.08;
      if (p.x < inset) {
        p.vx += insetacceleration;
      }
      if (p.x > bounds.right - inset) {
        p.vx -= insetacceleration;
      }
      if (p.y < inset) {
        p.vy += insetacceleration;
      }
      if (p.y > bounds.bottom - inset) {
        p.vy -= insetacceleration;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (params.lines) {
      ctx.strokeStyle = "black";
      // ctx.lineWidth = 2;
      ctx.beginPath();
      for (var t = 0; t < connections.length; t++) {
        let m = connections[t];
        var p = particles[m.p1];
        var j = particles[m.p2];
        ctx.moveTo(p.x * 2, p.y * 2);
        ctx.lineTo(j.x * 2, j.y * 2);
      }

      ctx.stroke();
    }
    if (params.dots) {
      for (var t = 0; t < particles.length; t++) {
        var p = particles[t];
        ctx.drawImage(circle, (p.x - 4) * 2, (p.y - 4) * 2);
      }
    }
  }

  /**
   * Atualiza a quantidade de partículas para o valor definido em params.nump;
   * Update the number of particles to the value defined in params.nump;
   */
  function matchNump() {
    if (params.nump < particles.length) {
      particles.pop();
    } else if (params.nump > particles.length) {
      particles.push(Particle());
    }
  }

  /**
   * Faça a simulação avançar um quadro;
   * Advance the simulation one frame;
   * @param {*} dt
   */
  function nextframe() {
    matchNump();
    updateconnections();
    draw();
    addvels();
  }

  /**
   * Reseta o número de partículas para o valor definido em params.nump;
   * Reset the particles to a random distribution;
   */
  function reset() {
    particles = [];
    for (var i = 0; i < params.nump; i++) {
      particles.push(Particle());
    }
  }

  function startdragging(point, radius) {
    drag = [];
    var r2 = radius * radius;
    for (var k = 0; k < particles.length; k++) {
      var j = particles[k];
      var dx = point[0] - j.x;
      var dy = point[1] - j.y;
      var d = dx * dx + dy * dy;
      if (d < r2) {
        drag.push(j);
      }
    }
  }

  function stopdragging() {
    drag = [];
  }

  function getparticles() {
    return particles;
  }

  return {
    reset: reset,
    nextframe: nextframe,
    startdragging: startdragging,
    stopdragging: stopdragging,
    getparticles: getparticles,
  };
}
