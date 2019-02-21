import { CircleData } from '../entities/Circle';
import SequenceManagerEntity from '../entities/SequenceManager';

interface Config {
  count: number;
}

export class SequenceManager implements SequenceManagerEntity {
  private obj: CircleData[];
  private config: Config;
  private checker: SequenceChecker;
  public seq: string[];
  constructor(obj: CircleData[], config?: Config) {
    this.obj = obj;
    this.seq = [];
    this.config = config || { count: 2 };
    this.checker = new SequenceChecker(this.seq);
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

  public eachWithInterval(timeout: number, callback: Function, end?: Function) {
    let seq = this.seq;
    const interval = setInterval(() => {
      if (seq.length) {
        callback(seq[0]);
        seq = seq.slice(1, seq.length);
      } else {
        clearInterval(interval);
        end && end();
      }
    }, timeout);
  }

  public check(input: string) {
    return this.checker.check(input, this.seq);
  }
}

class SequenceChecker {
  seq: string[];
  checkIndex: number;
  status: 'start' | 'progress' | 'end' | false;
  constructor(seq: string[]) {
    this.seq = seq;
    this.checkIndex = 0;
    this.status = false;
  }

  private unvalid() {
    this.checkIndex = 0;
    this.status = false;
  }

  private valid() {
    this.checkIndex++;
  }

  private statusHandler() {
    if (this.status === false) {
      return;
    }

    if (this.checkIndex === 0) {
      this.status = 'start';
    }

    if (this.checkIndex > 0 && this.checkIndex < this.seq.length) {
      this.status = 'progress';
    }

    if (this.checkIndex === this.seq.length) {
      this.checkIndex = 0;
      this.status = 'end';
    }
  }

  public check(input: string, seq?: string[]) {
    this.status === false && (this.status = 'start');
    seq && (this.seq = seq);
    input === this.seq[this.checkIndex] ? this.valid() : this.unvalid();

    this.statusHandler();

    return this.status;
  }
}
