import { Injectable } from '@angular/core';
import Phaser from 'phaser';
import machina from "machina";

interface BehaviorState {
  _onEnter?: () => void;
  [action: string]: any;
}


@Injectable({
  providedIn: 'root'
})

export class BehaviorsService {
  private state: string = 'idling';
  private states: Record<string, BehaviorState> = {};
  private entity: any;
  private name!: string;

  constructor() {}

  init({ scene, entity, name }: { scene: Phaser.Scene; entity: any; name: string }) {
    this.entity = entity;
    this.name = name;

    this.states = {
      idling: {
        _onEnter: () => {
          entity.sprite.body.setVelocityX(0);
          entity.sequence(name + 'idle');
        },
        walk: () => this.transition('walking'),
        run: () => this.transition('running'),
        jump: () => this.transition('jumping'),
        sit: () => this.transition('sitting')
      },
      walking: {
        _onEnter: () => {
          entity.sequence(name + 'walk');
        },
        walk: (data: any) => {
          const { velocity, direction } = data;
          let speed = direction === 'left' ? -velocity.walking : velocity.walking;
          entity.sprite.body.setVelocityX(speed);
          if (entity.direction !== direction) {
            entity.direction = direction;
            this.transition('turning', 'walk');
          }
        },
        idle: () => this.transition('idling'),
        run: () => this.transition('running'),
        jump: () => this.transition('jumping'),
        fall: () => this.transition('falling'),
        sit: () => this.transition('sitting')
      },
      running: {
        _onEnter: () => {
          entity.sequence(name + 'run');
        },
        run: (data: any) => {
          const { velocity, direction } = data;
          let speed = direction === 'left' ? -velocity.running : velocity.running;
          entity.sprite.body.setVelocityX(speed);
          if (entity.direction !== direction) {
            entity.direction = direction;
            this.transition('turning', 'running');
          }
        },
        walk: () => this.transition('walking'),
        idle: () => this.transition('idling'),
        jump: () => this.transition('jumping'),
        fall: () => this.transition('falling')
      },
      turning: {
        _onEnter: (prev?: string) => {
          entity.sprite.body.setVelocityX(0);
          entity.sequence(name + 'turn').then(() => {
            entity.sprite.setFlipX(entity.direction === 'left');
            entity.sprite.body.setOffset(entity.direction === 'left' ? 10 : 11, 9);
            this.transition('idling');
          });
        }
      },
      jumping: {
        _onEnter: () => {
          entity.sequence(name + 'jump');
        },
        jump: (data: any) => {
          const { velocity } = data;
          entity.sprite.body.setVelocityY(-velocity.jump);
        },
        walk: (data: any) => {
          const { velocity, direction } = data;
          let speed = direction === 'left' ? -velocity.airSpeed : velocity.airSpeed;
          entity.sprite.body.setVelocityX(speed);
        },
        run: (data: any) => {
          const { velocity, direction } = data;
          let speed = direction === 'left' ? -velocity.airSpeed : velocity.airSpeed;
          entity.sprite.body.setVelocityX(speed);
        },
        idle: () => {
          entity.sprite.body.setVelocityX(0);
        },
        fall: () => this.transition('falling')
      },
      falling: {
        _onEnter: () => {
          entity.sequence(name + 'down');
        },
        fall: () => {},
        walk: (data: any) => {
          const { velocity, direction } = data;
          let speed = direction === 'left' ? -velocity.airSpeed : velocity.airSpeed;
          entity.sprite.body.setVelocityX(speed);
        },
        run: (data: any) => {
          const { velocity, direction } = data;
          let speed = direction === 'left' ? -velocity.airSpeed : velocity.airSpeed;
          entity.sprite.body.setVelocityX(speed);
        },
        idle: () => {
          entity.sprite.body.setVelocityX(0);
        },
        land: () => this.transition('landing')
      },
      landing: {
        _onEnter: () => {
          entity.sprite.body.setVelocityX(0);
          entity.sequence(name + 'land').then(() => {
            this.transition('idling');
          });
        }
      },
      sitting: {
        _onEnter: () => {
          entity.sprite.body.setVelocityX(0);
          entity.sequence(name + 'sit');
        },
        idle: () => this.transition('gettingUp'),
        walk: () => this.transition('gettingUp'),
        run: () => this.transition('gettingUp'),
        jump: () => this.transition('gettingUp')
      },
      gettingUp: {
        _onEnter: () => {
          entity.sprite.body.setVelocityX(0);
          entity.sequence(name + 'getup').then(() => {
            this.transition('idling');
          });
        }
      }
    };

    this.transition('idling');
  }

  transition(newState: string, from?: string) {
    this.state = newState;
    const current = this.states[newState];
    if (current && current._onEnter) {
      current._onEnter();
    }
  }

  handle(action: string, data?: any) {
    const current = this.states[this.state];
    if (current && typeof current[action] === 'function') {
      current[action](data);
    } else if (typeof current?.[action] === 'string') {
      this.transition(current[action]);
    }
  }
}