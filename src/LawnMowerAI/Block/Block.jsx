
import React, {Component} from 'react';

import './Block.css';

export default class Block extends Component {
  render() {
    const {
      row,
      col,
      isFinish,
      isStart,
      isWall,
      isMowed,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : isMowed
      ? 'node-mowed'
      : ''

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}
