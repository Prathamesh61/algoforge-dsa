import { AlgorithmStep } from '@/types/visualizer';

export function generateLinearSearchSteps(array: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...array];
  let stepIndex = 0;

  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [0],
    pointerLabels: { 0: 'START' },
    highlightType: 'secondary',
    message: `Initialized Linear Search for target ${target} across ${arr.length} elements.`,
    pseudoCodeLine: 1,
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      stepIndex: stepIndex++,
      type: 'compare',
      arrayState: [...arr],
      indices: [i],
      pointerLabels: { [i]: `i = ${i}` },
      highlightType: 'primary',
      message: `Examining index ${i}: arr[${i}] = ${arr[i]}. Comparing with target ${target}.`,
      pseudoCodeLine: 2,
    });

    if (arr[i] === target) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'found',
        arrayState: [...arr],
        indices: [i],
        pointerLabels: { [i]: 'FOUND' },
        highlightType: 'success',
        message: `Match confirmed at index ${i}! arr[${i}] == ${target}.`,
        pseudoCodeLine: 3,
      });
      return steps;
    }
  }

  steps.push({
    stepIndex: stepIndex++,
    type: 'not-found',
    arrayState: [...arr],
    indices: [],
    highlightType: 'danger',
    message: `Scanned all ${arr.length} elements. Target ${target} not found.`,
    pseudoCodeLine: 4,
  });

  return steps;
}
