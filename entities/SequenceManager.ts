export default class SequenceManagerEntity {
  public seq: string[] = this.seq;


  /**
   * Base sequence initialization
   */
  public init: () => void = this.init;

  /**
   * Add random element to sequence
   * @param count Count of elements to add
   */
  public add: (count?: number) => void = this.add;

  /**
   * Clear sequence
   */
  public clear: () => void = this.clear;

  /**
   * Return each element of sequence with interval.
   * Element will be provided in callback function.
   * @param interval
   */
  public eachWithInterval: (interval: number, callback: Function) => void = this
    .eachWithInterval;
}
