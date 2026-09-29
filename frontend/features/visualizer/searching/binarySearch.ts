import { AlgorithmStep } from '@/types/visualizer';

export function generateBinarySearchSteps(sortedArray: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...sortedArray].sort((a, b) => a - b);
  let low = 0;
  let high = arr.length - 1;
  let stepIndex = 0;

  // Initial step
  steps.push({
    stepIndex: stepIndex++,
    type: 'highlight',
    arrayState: [...arr],
    indices: [low, high],
    pointerLabels: { [low]: 'LOW', [high]: 'HIGH' },
    highlightType: 'secondary',
    message: `Initialized Binary Search on array of ${arr.length} elements for target ${target}. Search range: [${low}..${high}].`,
    pseudoCodeLine: 1,
  });

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);

    // Mid pointer calculation step
    steps.push({
      stepIndex: stepIndex++,
      type: 'compare',
      arrayState: [...arr],
      indices: [low, mid, high],
      pointerLabels: { [low]: 'LOW', [mid]: 'MID', [high]: 'HIGH' },
      highlightType: 'primary',
      message: `Calculated mid = ${mid} (value = ${arr[mid]}). Comparing arr[mid] with target ${target}.`,
      pseudoCodeLine: 4,
    });

    if (arr[mid] === target) {
      steps.push({
        stepIndex: stepIndex++,
        type: 'found',
        arrayState: [...arr],
        indices: [mid],
        pointerLabels: { [mid]: 'TARGET FOUND' },
        highlightType: 'success',
        message: `Target ${target} located at index ${mid}!`,
        pseudoCodeLine: 5,
      });
      return steps;
    } else if (arr[mid] < target) {
      const nextLow = mid + 1;
      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [mid, high],
        pointerLabels: { [mid]: 'TOO SMALL', [high]: 'HIGH' },
        highlightType: 'warning',
        message: `arr[mid] (${arr[mid]}) < ${target}. Target must be in right half. Discarding left half; updating low = ${nextLow}.`,
        pseudoCodeLine: 8,
      });
      low = nextLow;
    } else {
      const nextHigh = mid - 1;
      steps.push({
        stepIndex: stepIndex++,
        type: 'modify',
        arrayState: [...arr],
        indices: [low, mid],
        pointerLabels: { [low]: 'LOW', [mid]: 'TOO LARGE' },
        highlightType: 'warning',
        message: `arr[mid] (${arr[mid]}) > ${target}. Target must be in left half. Discarding right half; updating high = ${nextHigh}.`,
        pseudoCodeLine: 10,
      });
      high = nextHigh;
    }
  }

  // Not found step
  steps.push({
    stepIndex: stepIndex++,
    type: 'not-found',
    arrayState: [...arr],
    indices: [],
    highlightType: 'danger',
    message: `low (${low}) > high (${high}). Search space exhausted. Target ${target} does not exist in array.`,
    pseudoCodeLine: 11,
  });

  return steps;
}
