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
   * @param callback Called each interval tick. Default argument: current sequence element
   * @param end Called on the end of sequence. No arguments.
   */
  public eachWithInterval: (
    interval: number,
    callback: Function,
    end?: Function
  ) => void = this.eachWithInterval;

  /**
   * Function to check with next sequence element
   * @param color string to check in sequence
   */
  public check: (color: string) => 'start' | 'progress' | 'end' | false = this
    .check;
}
