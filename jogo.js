class Jogo extends Phaser.Scene {
    constructor() {
        super({ key: 'Jogo' });

        this.fundos = []; // Array para armazenar os fundos
        this.bgSpeed = 5; // Velocidade do movimento dos fundos
        this.cubo;
        this.hazards; // Grupo de hazards
        this.teclado;
        this.platforma;
        this.gameOverText;
        this.hazardSpawnTimer; // Timer para controlar o spawn dos hazards
        this.hazardSpeed = 10; // Velocidade dos hazards (independente do fundo)
        this.score = 0; // Pontuação atual
        this.scoreText; // Texto para exibir a pontuação
        this.isOnGroundOrCeiling = false; // Verifica se o cubo está no chão ou no teto
    }

    preload() {
        this.load.image('bg1', 'assets/BG1.png'); // fundo com teto e chão
        this.load.image('cubo', 'assets/CUBO.png');
        this.load.image('hazard', 'assets/HAZARD.png');
        this.load.image('g1', 'assets/G1.png'); // chão
        this.load.image('g2', 'assets/G2.png'); // teto
    }

    create() {
        // Adiciona os fundos no array para criar o efeito de loop contínuo
        let numFundos = 2; // Número de fundos que você quer
        for (let i = 0; i < numFundos; i++) {
            let fundo = this.add.image(800 + (i * 1600), 450, 'bg1'); // Posiciona os fundos consecutivamente
            this.fundos.push(fundo); // Adiciona o fundo ao array
        }

        // Cria o cubo e habilita a física
        this.cubo = this.physics.add.sprite(700, 400, 'cubo');
        this.cubo.setCollideWorldBounds(true); // Permite colisão com os limites da tela (incluindo o chão e teto)
        
        // Cria um grupo de hazards
        this.hazards = this.physics.add.group();

        // Teclado
        this.teclado = this.input.keyboard.createCursorKeys();
        
        // Criando as plataformas (g1 e g2) com física estática
        this.platforma = this.physics.add.staticGroup();

        // Chão (g1)
        this.platforma.create(800, 872.5, 'g1');  

        // Teto (g2)
        this.platforma.create(800, 27.5, 'g2'); 
        
        // Colisões do cubo com o chão e o teto
        this.physics.add.collider(this.cubo, this.platforma, this.onGroundOrCeiling, null, this);

        // Colisão entre o cubo e os hazards (obstáculos)
        this.physics.add.collider(this.cubo, this.hazards, this.colidirComHazard, null, this);
        
        // Adicionando texto de "Game Over" (inicialmente invisível)
        this.gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
        this.gameOverText.setVisible(false); // Não aparece no início

        // Texto para exibir a pontuação
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '24px', fill: '#ffffff' });

        // Configura o timer para spawnar hazards
        this.hazardSpawnTimer = this.time.addEvent({
            delay: 1000, // Spawn a cada 1 segundo
            callback: this.spawnHazard,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Movimento dos fundos (movimento para a esquerda)
        this.fundos.forEach(fundo => {
            fundo.x -= this.bgSpeed;
        });

        // Reposiciona os fundos quando saem da tela
        // Verifica se algum fundo saiu da tela e reposiciona ao final do array
        this.fundos.forEach((fundo, index) => {
            if (fundo.x + fundo.width / 2 <= 0) {
                let próximoFundo = this.fundos[(index + 1) % this.fundos.length];
                fundo.x = próximoFundo.x + próximoFundo.width; // Posiciona o fundo à direita do próximo fundo
            }
        });

        // Controle do cubo com o espaço (salto)
        if (this.teclado.space.isDown) {
            this.cubo.setVelocityY(-650);
        } else {
            this.cubo.setVelocityY(650);
        }

        // Move os hazards para a esquerda com velocidade independente
        this.hazards.getChildren().forEach((hazard) => {
            if (hazard.active) { // Verifica se o hazard ainda está ativo
                hazard.x -= this.hazardSpeed; // Usa a velocidade específica dos hazards

                // Remove o hazard se ele sair da tela
                if (hazard.x + hazard.width / 2 <= 0) {
                    hazard.destroy();
                }
            }
        });

        // Atualiza a pontuação se o cubo estiver no ar
        if (!this.isOnGroundOrCeiling) {
            this.score += 1; // Incrementa a pontuação
            this.scoreText.setText(`Score: ${this.score}`);
        }
    }

    // Função chamada quando o cubo está no chão ou no teto
    onGroundOrCeiling() {
        this.isOnGroundOrCeiling = true;
        this.time.delayedCall(100, () => {
            this.isOnGroundOrCeiling = false;
        }, [], this);
    }

    // Função para spawnar hazards
    spawnHazard() {
        let hazard = this.hazards.create(1600, Phaser.Math.Between(100, 800), 'hazard');
        hazard.setImmovable(true);
    }

    // Função chamada quando o cubo colide com o hazard
    colidirComHazard(cubo, hazard) {
        // Torna o cubo invisível ou reinicia o jogo
        cubo.setVisible(false);
        
        // Exibe o texto de Game Over
        this.gameOverText.setVisible(true);

        // Reinicia o jogo após 2 segundos
        this.time.delayedCall(2000, () => {
            this.scene.restart(); // Reinicia a cena após 2 segundos
        });
    }
}

window.Jogo = Jogo;

// fiz os sprites e grande parte do codigo. tava evitando usar IA, mas o cara da monitoria usou e dps eu continuei usando... acredito que não tenha interferido no meu aprendizado :D