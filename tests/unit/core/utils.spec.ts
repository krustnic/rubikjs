import { assert } from 'chai';
import { Point } from '@/core/types/opencv';
import { getAngle, isEpsilonEquals } from '@/core/utils.ts';

describe('Utils', () => {
  it('return right line angle by two points', () => {
    const p1: Point = {
      x: 0,
      y: 0,
    };

    const p2: Point = {
      x: 10,
      y: 10,
    };

    let angle;
    angle = getAngle(p1, p2);
    assert.equal(angle, -45);

    angle = getAngle(p2, p1);
    assert.equal(angle, 135);
  });

  it('isEpsilonEquals works', () => {
    assert.isTrue(isEpsilonEquals(1, 2, 1));
    assert.isFalse(isEpsilonEquals(1, 3, 1));
    assert.isFalse(isEpsilonEquals(0.5, 0.6, 0.05));
  });
});
