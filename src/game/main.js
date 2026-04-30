import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { CinematicScene } from './scenes/CinematicScene';
import { IntroScene } from './scenes/IntroScene';
import { StarterScene } from './scenes/StarterScene';
import { MainMenu } from './scenes/MainMenu';
import { WorldScene } from './scenes/WorldScene';
import { BattleScene } from './scenes/BattleScene';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game as PhaserGame } from 'phaser';

const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        CinematicScene,
        IntroScene,
        StarterScene,
        MainMenu,
        WorldScene,
        BattleScene,
        Game,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new PhaserGame({ ...config, parent });

}

export default StartGame;
