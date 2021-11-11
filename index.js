#!/usr/bin/env node

import { spawn } from 'child_process';
import notifier from 'node-notifier';
import fs from 'fs/promises';
import { format, parseValue, parseUnit } from './utils.js';

const refreshDelai = 1000;
const fifo = '/tmp/timinou.fifo';
const output = '/tmp/timinou.txt';

function mkFifo(fifo) {
  return new Promise((resolve, reject) => {
    const proc = spawn('mkfifo', [fifo, '-m', 644], { stdio: 'ignore' });
    proc.once('close', resolve);
    proc.once('error', reject);
  });
}

class CountDown {
  interval;
  remains;
  ends;
  name;
  counter;

  title() {
    let res = this.name;
    if (this.counter > 0) res += ` (${this.counter})`;
    return res;
  }

  async refresh(now) {
    let res = this.title();
    const time = this.remains ? this.remains : this.ends - now;
    res += ' ' + format(Math.ceil(time / this.unit));
    if (this.remains) {
      res += ' P';
    }
    await fs.writeFile(output, res);
  }

  setup(name, length, unit) {
    this.name = name;
    this.total = length * unit;
    this.unit = unit;
    this.counter = 0;
  }

  async starting(length) {
    clearInterval(this.interval);
    const now = Date.now();
    this.ends = now + length;
    this.remains = undefined;
    this.interval = setInterval(async () => {
      const now = Date.now();
      if (now > this.ends) {
        clearInterval(this.interval);
        this.remains = undefined;
        await fs.writeFile(output, '');
        notifier.notify(`${this.title()} finished`);
        return;
      }
      await this.refresh(now);
    }, refreshDelai);
    await this.refresh(now);
  }

  async pause() {
    clearInterval(this.interval);
    const now = Date.now();
    this.remains = this.ends - now;
    await this.refresh(now);
  }

  async start(name, length, unit) {
    this.setup(name, length, unit);
    await this.starting(this.total);
  }

  async stop() {
    clearInterval(this.interval);
    await fs.writeFile(output, '');
  }

  async reset() {
    await this.starting(this.total);
  }

  async resume() {
    await this.starting(this.remains || this.total);
  }

  async openTask(name) {
    clearInterval(this.interval);
    await fs.writeFile(output, name);
  }

  async repeat() {
    this.counter++;
    await this.reset();
  }
}

const countDown = new CountDown();

await mkFifo(fifo);
console.log('Listening to ', fifo);
mainLoop: while (true) {
  let command = await fs.readFile(fifo, 'utf8');
  command = command.trim();
  console.log('>', command);
  const parsed = command.split(' ');
  let name;
  switch (parsed[0]) {
    case 'start':
      name = parsed[1];
      const arg = parsed[2];
      if (arg) {
        const value = parseValue(arg);
        const unit = parseUnit(arg);
        await countDown.start(name, value, unit);
        break;
      }
      await countDown.openTask(name);
      break;
    case 'repeat':
      await countDown.repeat();
      break;
    case 'reset':
      await countDown.reset();
      break;
    case 'resume':
      await countDown.resume();
      break;
    case 'stop':
      await countDown.stop();
      break;
    case 'pause':
      await countDown.pause();
      break;
    case 'quit':
      await countDown.stop();
      break mainLoop;
    default:
      console.log(`Unknown command: ${command}`);
  }
}
console.log('Stopped');
