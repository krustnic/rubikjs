import { IState } from '@/core/types/app';
import { sharedState } from '@/store/shared';

const state: IState = {
  ...sharedState,
};

export default state;
