import Vue from 'vue';
import Vuex, { MutationTree, GetterTree, ActionTree } from 'vuex';

import { Mat } from '@/core/types/opencv';
import {
  IState,
  CubeTriplet,
  TripletColors,
  Configuration,
  Solution,
} from '@/core/types/app';
import { resolve, BadCubeScheme } from '@/core/ResolverTools';
import { replaceInArray, replaceInString } from '@/core/FridrihTools';
import defaultState from 'default-state';

Vue.use(Vuex);

const globalState: IState = {
  ...defaultState,
};

const mutations: MutationTree<IState> = {
  setCubeTriplet1(state, { triplet }) {
    state.cubeTriplet1 = triplet;
  },
  setCubeTriplet2(state, { triplet }) {
    state.cubeTriplet2 = triplet;
  },
  clear(state) {
    state.cubeTriplet1 = null;
    state.cubeTriplet2 = null;

    state.tripletColor1 = new TripletColors({
      left: Array<string>(9).fill('blue'),
      right: Array<string>(9).fill('red'),
      top: Array<string>(9).fill('yellow'),
    });

    state.tripletColor2 = new TripletColors({
      left: Array<string>(9).fill('orange'),
      right: Array<string>(9).fill('green'),
      top: Array<string>(9).fill('white'),
    });

    state.isValidCube = true;
  },
  setTripletColor(state, { index, triplet }) {
    if (index === 0) {
      state.tripletColor1 = triplet;
    } else {
      state.tripletColor2 = triplet;
    }
  },
  setSolveMoves(state, { moves }) {
    state.solveMoves = moves;
  },
  setCubeValidationStatus(state, { isValid }) {
    state.isValidCube = isValid;
  },
};

const actions: ActionTree<IState, any> = {
  async recognizeCube({ state, commit }, image: Mat): Promise<any> {
    if (!state.cubeRecognizer.isInit) {
      await state.cubeRecognizer.init();
    }
    const data = await state.cubeRecognizer.predict(image);
    return data;
  },
  async recognizeColor({ state, commit }, crop: Mat): Promise<any> {
    if (!state.colorRecognizer.isInit) {
      await state.colorRecognizer.init();
    }
    const data = await state.colorRecognizer.predict(crop);
    return data;
  },
  async resolvePuzzle({ state, commit }): Promise<any> {
    const { tripletColor1, tripletColor2 } = state;

    try {
      const moves: Solution = await resolve(tripletColor1, tripletColor2);
      const isValid = true;
      commit('setSolveMoves', { moves });
      commit('setCubeValidationStatus', { isValid });
    } catch (e) {
      if (e instanceof BadCubeScheme) {
        const isValid = false;
        commit('setCubeValidationStatus', { isValid });
      }
    }
  },
};

const globalGetters: GetterTree<IState, any> = {
  centers(state: IState): string[] {
    if (state.tripletColor1 === null || state.tripletColor2 === null) {
      return [];
    }

    // Sides centers in order: D R F U L B
    const arr: string[] = [
      state.tripletColor2.top[4],
      state.tripletColor1.right[4],
      state.tripletColor1.left[4],
      state.tripletColor1.top[4],
      state.tripletColor2.left[4],
      state.tripletColor2.right[4],
    ];

    return arr;
  },
  // Return solution with replaced "prime" to "'"
  plainSolution(state: IState): Solution {
    const solution: Solution = state.solveMoves || {
      cross: [],
      f2l: [],
      oll: '',
      pll: '',
    };

    const plainSolution: Solution = {
      cross: replaceInArray(solution.cross),
      f2l: replaceInArray(solution.f2l),
      oll: replaceInString(solution.oll),
      pll: replaceInString(solution.pll),
    };

    return plainSolution;
  },
  isCubeSolved(state: IState, getters: any): boolean {
    const solution = getters.plainSolution as Solution;
    if (
      solution.cross.length === 0 &&
      solution.f2l.length === 0 &&
      solution.oll.length === 0 &&
      solution.pll.length === 0
    ) {
      return true;
    }

    return false;
  },
};

export default new Vuex.Store({
  state: globalState,
  mutations,
  actions,
  getters: globalGetters,
});
