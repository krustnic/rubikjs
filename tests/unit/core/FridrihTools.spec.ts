import { assert } from 'chai';
import { getFullAlgorithm, replaceInArray } from '@/core/FridrihTools';
import { Alg, Solution } from '@/core/types/app';

describe('Fridrih tools', () => {
  it('Get full algorithm from partitioned object', () => {
    const obj = {
      cross: ['U2 Bprime U2', 'Uprime L U', 'Dprime L2', 'R2'],
      f2l: [
        'L D Lprime D2 L D2 Lprime D Fprime Dprime F',
        'D B D Bprime D Lprime Dprime L',
        'Bprime D2 B D Bprime Dprime B',
        'D2 F Dprime Fprime D Rprime Dprime R',
      ],
      oll: 'Rprime Bprime R Fprime Rprime B2 Rprime Bprime R2 F',
      pll:
        'L Dprime Lprime Dprime L D L U Lprime Dprime L Uprime Lprime D2 Lprime Dprime',
    };

    const alg = getFullAlgorithm(obj);
    const trueAlg = new Alg(
      "U2 B' U2 U' L U D' L2 R2 L D L' D2 L D2 L' D F' D' F D B D B' D L' D'" +
        " L B' D2 B D B' D' B D2 F D' F' D R' D' R R' B' R F' R' B2 R' B'" +
        " R2 F L D' L' D' L D L U L' D' L U' L' D2 L' D'",
    );

    const reversAlg = new Alg(
      "D' L' D2 L' U' L D' L' U L D L D' L' D' L F R2 B' R' B2 R' F' R B' R' R" +
        " D' R' D F' D' F D2 B D' B' D B D2 B' L D' L' D B' D B D F D' F' D L' D2 L D2 L' D L R2 L2 D' U L U' U2 B' U2",
    );

    assert.equal(alg.toString(), trueAlg.toString());
    assert.equal(reversAlg.toString(), trueAlg.reverse().toString());
  });

  it('Get array with replaced "prime" to "\'"', () => {
    assert.equal(
      replaceInArray(['L D Lprime D2 L D2 Lprime D Fprime Dprime F'])[0],
      "L D L' D2 L D2 L' D F' D' F",
    );
    assert.equal(replaceInArray(['L'])[0], 'L');
  });

  it('Get array with removed empty items', () => {
    assert.equal(replaceInArray(['']).length, 0);
    assert.equal(replaceInArray(['Lprime', '', '', '']).length, 1);
    assert.equal(replaceInArray(['Lprime', '', '', 'Lprime']).length, 2);
  });
});
