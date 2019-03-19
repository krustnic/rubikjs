import {
  IState,
  CubeTriplet,
  TripletColors,
  Configuration,
} from '@/core/types/app';
import { ColorRecognizer } from '@/core/ColorRecognizerTF';
import { CubeRecognizer } from '@/core/CubeRecognizerTF';

const configuration: Configuration = {
  segmentationModelPath: 'models/seg-128/model.json',
  colorModelPath: 'models/color/model.json',
  segmentationModelInputSize: 128,
  colorModelInputSize: 32,
  maxHexagonAngle: 12,
};

export const sharedState: IState = {
  configuration,
  cubeRecognizer: new CubeRecognizer(configuration),
  colorRecognizer: new ColorRecognizer(configuration),

  cubeTriplet1: null,
  cubeTriplet2: null,

  tripletColor1: new TripletColors({
    left: Array<string>(9).fill('blue'),
    right: Array<string>(9).fill('red'),
    top: Array<string>(9).fill('yellow'),
  }),
  tripletColor2: new TripletColors({
    left: Array<string>(9).fill('orange'),
    right: Array<string>(9).fill('green'),
    top: Array<string>(9).fill('white'),
  }),

  solveMoves: null,

  isValidCube: true,
};
