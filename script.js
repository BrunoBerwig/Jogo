const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');
let gravidade = 0.65;

document.addEventListener("click", (e) => {
    if(gameOver==true){
        location.reload()
    }
})

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadey = -15; 
        personagem.pulando = true;
    }
});

let gameOver = false;
let pontuacao = 0;

const personagem = {
    posx:50,
    posy:canvas.height-50,
    largura:50,
    altura:50,
    velocidadey:0,
    pulando: false
}

function desenhaPersonagem(){
    ctx.fillStyle = 'blue';
    ctx.fillRect(personagem.posx,
        personagem.posy,
        personagem.largura,
        personagem.altura);
}

function atualizaPersonagem(){
    if(personagem.pulando == true){
        personagem.velocidadey += gravidade; 
        personagem.posicaoy += personagem.velocidadey;
        personagem.posy += personagem.velocidadey;
        if(personagem.posicaoy >= canvas.height-50){
            personagem.velocidadey = 0;
            personagem.pulando = false;
        }
    }
}

const obstaculo = {
    posx: canvas.width-100,
    posy: canvas.height-100,
    tamx: 50,
    tamy: 100,
    velocidade: 6.5
};

function desenhaObstaculo(){
    ctx.fillStyle = 'red';
    ctx.fillRect(obstaculo.posx, obstaculo.posy, obstaculo.tamx, obstaculo.tamy);
}

function atualizaObstaculo() {
    obstaculo.posx -= obstaculo.velocidade;
    
    if(obstaculo.posx <= 0 - obstaculo.tamx) {
        obstaculo.posx = canvas.width - 100;
        let altura_random = (Math.random() * 50) + 90;
        obstaculo.tamy = altura_random;
        obstaculo.posy = canvas.height - altura_random;
        obstaculo.velocidade += 0.5;
        pontuacao += 1;
    }
}

function verificaPosicaoChao() {
    if (personagem.posy >= canvas.height - personagem.altura) {
        personagem.posy = canvas.height - personagem.altura;
        personagem.pulando = false;
        personagem.velocidadey = 0; 
    }
}

function verificaColisao() {
    if (
        personagem.posx < obstaculo.posx + obstaculo.tamx &&
        personagem.posx + personagem.largura > obstaculo.posx &&
        personagem.posy < obstaculo.posy + obstaculo.tamy &&
        personagem.posy + personagem.altura > obstaculo.posy
    ) {
        houveColisao();
    }
}

function houveColisao(){
    obstaculo.velocidade = 0;
    atualizaObstaculo();
    ctx.fillStyle = 'red';
    const largura = 400;
    const altura = 100;
    ctx.fillRect((canvas.width / 2) - (largura / 2), (canvas.height / 2) - (altura / 2), largura, altura);
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';

    const texto = "GAME OVER";
    const textoWidth = ctx.measureText(texto).width;
    ctx.fillText(texto, (canvas.width / 2) - (textoWidth / 2), (canvas.height / 2) + 20);
    gameOver = true;
}

function desenhaPontuacao() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Pontuação: ' + pontuacao, 20, 40);
}

function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenhaObstaculo();
    atualizaPersonagem();
    verificaPosicaoChao();
    desenhaPersonagem();
    atualizaObstaculo();
    verificaColisao();
    desenhaPontuacao();
    requestAnimationFrame(loop);
}

loop();
