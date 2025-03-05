const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

class Personagem {
    constructor(x, y, largura, altura) {
        this.posx = x;
        this.posy = y;
        this.largura = largura;
        this.altura = altura;
        this.velocidadey = 0;
        this.pulando = false;
    }

    desenhar(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.posx, this.posy, this.largura, this.altura);
    }
    atualizar(gravidade, canvasHeight) {
        if (this.pulando) {
            this.velocidadey += gravidade;
            this.posy += this.velocidadey;
            if (this.posy >= canvasHeight - this.altura) {
                this.posy = canvasHeight - this.altura;
                this.velocidadey = 0;
                this.pulando = false;
            }
        }
    }

    pular() {
        if (!this.pulando) {
            this.velocidadey = -15;
            this.pulando = true;
        }
    }

    verificarPosicaoChao(canvasHeight) {
        if (this.posy >= canvasHeight - this.altura) {
            this.posy = canvasHeight - this.altura;
            this.pulando = false;
            this.velocidadey = 0;
        }
    }
}

class Obstaculo {
    constructor(x, y, tamx, tamy, velocidade) {
        this.posx = x;
        this.posy = y;
        this.tamx = tamx;
        this.tamy = tamy;
        this.velocidade = velocidade;
        this.pontuado = false;
    }
    desenhar(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.posx, this.posy, this.tamx, this.tamy);
    }

    atualizar(canvasWidth, canvasHeight) {
        this.posx -= this.velocidade;
        if (this.posx <= 0 - this.tamx) {
            this.posx = canvasWidth - 100;
            let altura_random = (Math.random() * 50) + 90;
            this.tamy = altura_random;
            this.posy = canvasHeight - altura_random;
            this.velocidade += 0.5;
            this.pontuado = false;
        }
    }
}

class Jogo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gravidade = 0.65;
        this.gameOver = false;
        this.pontuacao = 0;
        this.personagem = new Personagem(50, canvas.height - 50, 50, 50);
        this.obstaculo = new Obstaculo(canvas.width - 100, canvas.height - 100, 50, 100, 6.5);
        this.iniciarEventos();
    }

    iniciarEventos() {
        document.addEventListener("click", (e) => {
            if (this.gameOver) {
                location.reload(); 
            }
        });

        document.addEventListener('keypress', (e) => {
            if (e.code === 'Space') {
                this.personagem.pular();
            }
        });
    }

    verificarColisao() {
        if (
            this.personagem.posx < this.obstaculo.posx + this.obstaculo.tamx &&
            this.personagem.posx + this.personagem.largura > this.obstaculo.posx &&
            this.personagem.posy < this.obstaculo.posy + this.obstaculo.tamy &&
            this.personagem.posy + this.personagem.altura > this.obstaculo.posy
        ) {
            this.houveColisao();
        }
    }

    houveColisao() {
        this.obstaculo.velocidade = 0;
        this.gameOver = true;
        this.ctx.fillStyle = 'red';
        const largura = 400;
        const altura = 100;
        this.ctx.fillRect((this.canvas.width / 2) - (largura / 2), (this.canvas.height / 2) - (altura / 2), largura, altura);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '50px Arial';
        const texto = "GAME OVER";
        const textoWidth = this.ctx.measureText(texto).width;
        this.ctx.fillText(texto, (this.canvas.width / 2) - (textoWidth / 2), (this.canvas.height / 2) + 20);
    }

    desenharPontuacao() {
        if (!this.gameOver) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('Pontuação: ' + this.pontuacao, 20, 40);
        }
    }

    loop() {
        if (this.gameOver) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.obstaculo.atualizar(this.canvas.width, this.canvas.height);
        this.personagem.atualizar(this.gravidade, this.canvas.height);
        this.personagem.verificarPosicaoChao(this.canvas.height);
        this.obstaculo.desenhar(this.ctx);
        this.personagem.desenhar(this.ctx);
        if (this.obstaculo.posx + this.obstaculo.tamx < this.personagem.posx && !this.obstaculo.pontuado) {
            this.pontuacao++;
            this.obstaculo.pontuado = true;
        }
        this.verificarColisao();
        this.desenharPontuacao();
        requestAnimationFrame(() => this.loop());
        
    }
    iniciar() {
        this.loop();
    }
}

const jogo = new Jogo(canvas);
jogo.iniciar()