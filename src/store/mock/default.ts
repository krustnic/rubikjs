import { IState, TripletColors } from '@/core/types/app';
import { sharedState } from '@/store/shared';

const state: IState = {
  ...sharedState,

  tripletColor1: new TripletColors({
    left: [
      'white',
      'blue',
      'blue',
      'red',
      'red',
      'green',
      'blue',
      'blue',
      'yellow',
    ],
    right: [
      'yellow',
      'white',
      'orange',
      'red',
      'green',
      'yellow',
      'green',
      'green',
      'green',
    ],
    top: [
      'blue',
      'blue',
      'green',
      'white',
      'yellow',
      'orange',
      'blue',
      'white',
      'orange',
    ],
  }),
  tripletColor2: new TripletColors({
    left: [
      'white',
      'red',
      'green',
      'white',
      'blue',
      'yellow',
      'orange',
      'green',
      'yellow',
    ],
    right: [
      'red',
      'yellow',
      'orange',
      'red',
      'orange',
      'green',
      'red',
      'orange',
      'yellow',
    ],
    top: [
      'red',
      'orange',
      'white',
      'yellow',
      'white',
      'orange',
      'red',
      'blue',
      'white',
    ],
  }),
  solveMoves: {
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
  },
};

export default state;
