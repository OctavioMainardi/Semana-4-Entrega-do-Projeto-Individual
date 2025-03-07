class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' }); // Define a chave da cena como 'Menu'
    }

    create() {
        // Adiciona o texto "Jogar" no centro da tela e o de baixo (controle)
        const controleText = this.add.text(
            this.cameras.main.width / 2, // Posição X 
            this.cameras.main.height / 1.5, // Posição Y 
            'Pressione ESPAÇO para voar', // Texto exibido
            {   
                fontSize: '32px', // Tamanho da fonte
                fill: '#ffffff', // Cor do texto (branco)
                fontStyle: 'bold' // Estilo da fonte (negrito)
            }
        ).setOrigin(0.5);
        const jogarText = this.add.text(
            this.cameras.main.width / 2, // Posição X (centro da tela)tx
            this.cameras.main.height / 2, // Posição Y (centro da tela)
            'Jogar', // Texto exibido
            { 
                fontSize: '64px', // Tamanho da fonte
                fill: '#ffffff', // Cor do texto (branco)
                fontStyle: 'bold' // Estilo da fonte (negrito)
            }
        ).setOrigin(0.5); // Centraliza o texto

        // Torna o texto interativo (clicável)
        jogarText.setInteractive();

        // Adiciona um evento de clique ao texto
        jogarText.on('pointerdown', () => {
            this.scene.start('Jogo'); // Inicia a cena 'Jogo' ao clicar no texto
        });

        // Efeito de hover (muda a cor do texto quando o mouse passa por cima)
        jogarText.on('pointerover', () => {
            jogarText.setStyle({ fill: '#ff0' }); // Muda a cor para amarelo
        });

        jogarText.on('pointerout', () => {
            jogarText.setStyle({ fill: '#ffffff' }); // Volta à cor branca
        });
    }
}

window.Menu = Menu; // Torna a classe Menu acessível globalmente