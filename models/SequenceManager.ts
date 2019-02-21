import { CircleData } from '../entities/Circle';
import SequenceManagerEntity from '../entities/SequenceManager';

interface Config {
  count: number;
}

export class SequenceManager implements SequenceManagerEntity {
  private obj: CircleData[];
  private config: Config;
  public seq: string[];
  constructor(obj: CircleData[], config?: Config) {
    this.obj = obj;
    this.seq = [];
    this.config = config || { count: 2 };
  }

  /**
   * Get random element from obj array
   */
  private random() {
    return this.obj[Math.floor(Math.random() * this.obj.length)];
  }

  public init() {
    this.clear();
    this.add(this.config.count);
  }

  public add(count?: number) {
    const f = () => (this.seq = this.seq.concat(this.random().color));
    count ? Array.apply(null, Array(count)).map(() => f()) : f();
  }

  public clear() {
    this.seq = [];
  }

  eachWithInterval(timeout: number, callback: Function) {
    let seq = this.seq;
    const interval = setInterval(() => {
      if (seq.length) {
        callback(seq[0]);
        seq = seq.slice(1, seq.length);
      } else {
        clearInterval(interval);
      }
    }, timeout);
  }
}
